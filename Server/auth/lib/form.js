const constraints = require('./constraints.js'),
  validate = require('./validator');

const form = {
  defs: {
    signUp: {
      fields: [
        {
          name: 'name',
          label: 'Full Name',
          autoComplete: 'name',
          constraints: constraints['name']
        },
        {
          name: 'userName',
          label: 'User Name',
          autoComplete: 'username',
          constraints: constraints['userName']
        },
        {
          name: 'confirmEmail',
          label: 'Email',
          autoComplete: 'email',
          constraints: constraints['email']
        },
        {
          name: 'password',
          label: 'Password',
          autoComplete: 'off',
          constraints: constraints['password']
        },
        {
          name: 'passwordConfirm',
          label: 'Confirm Password',
          autoComplete: 'off',
          constraints: constraints['passwordConfirm']
        }
      ]
    }
  },

  fieldProps: (formName, propNames, fieldNames) => {
    if (!form.defs[formName]) return {};
    propNames = Array.isArray(propNames) ? propNames : [];
    fieldNames = Array.isArray(fieldNames) ? fieldNames : [];

    return form.defs[formName].fields
      .filter(
        field => fieldNames.length === 0 || fieldNames.includes(field.name)
      )
      .reduce((fieldAcc, field) => {
        fieldAcc[field.name] = Object.entries(field).reduce(
          (propAcc, [propName, propValue]) => {
            if (propNames.length === 0 || propNames.includes(propName))
              propAcc[propName] = propValue;
            return propAcc;
          },
          {}
        );
        return fieldAcc;
      }, {});
  },

  fieldPropValues: (formName, propName, fieldNames) => {
    if (!form.defs[formName] || !(typeof propName === 'string')) return {};
    fieldNames = Array.isArray(fieldNames) ? fieldNames : [];

    return form.defs[formName].fields.reduce((acc, props) => {
      if (fieldNames.length === 0 || fieldNames.includes(props.name))
        acc[props.name] = props[propName];
      return acc;
    }, {});
  },

  fieldConstraints: (formName, context, fieldNames) => {
    if (!form.defs[formName]) return {};
    if (context === 'partial' && !Array.isArray(fieldNames)) return {};

    switch (context) {
      case 'partial':
        // validation context: one or more fields (vs. the whole form)
        const formFieldNames = Object.keys(
          form.fieldPropValues(formName, 'name')
        );
        const fieldNamesAreValid =
          fieldNames.filter(fieldName => !formFieldNames.includes(fieldName))
            .length === 0;

        return form.fieldPropValues(
          formName,
          'constraints',
          fieldNamesAreValid ? fieldNames : formFieldNames
        );

      case 'server':
        // validation context: server-side (ignore confirmation fields)
        const allConstraints = form.fieldPropValues(formName, 'constraints');

        return Object.keys(allConstraints).reduce((acc, name) => {
          if (name.substr(-7) !== 'Confirm') acc[name] = allConstraints[name];
          return acc;
        }, {});

      default:
        // validation context: client/default (all fields)
        return form.fieldPropValues(formName, 'constraints');
    }
  },

  isValid: async (formName, fieldInputs, context) => {
    try {
      if (!form.defs[formName] || !fieldInputs)
        throw new Error('required parameter is missing or invalid');

      const validatedResults = await validate.async(
        fieldInputs,
        form.fieldConstraints(formName, context, Object.keys(fieldInputs)),
        { fullMessages: false }
      );
      return { valid: true, validatedResults };
    } catch (errors) {
      return {
        valid: false,
        errors: errors.message ? { exception: [errors.message] } : errors
      };
    }
  }
};

module.exports = form;
