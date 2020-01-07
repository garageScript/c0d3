const constraints = {
  name: {
    presence: { allowEmpty: false },
    format: {
      pattern: /^[a-zA-Z]+[a-zA-Z0-9]*([- ]{1}[a-zA-Z0-9]+)*$/,
      message:
        'may only contain alphanumeric characters, optionally separated by single hyphens or spaces, must start with a letter'
    },
    length: {
      minimum: 2,
      maximum: 64,
      tooShort: 'too short (minimum is %{count} characters)',
      tooLong: 'too long (maximum is %{count} characters)'
    }
  },
  userName: {
    presence: { allowEmpty: false },
    format: {
      pattern: /^[a-z]+[a-z0-9]*(-{1}[a-z0-9]+)*$/,
      message:
        'may only contain lowercase alphanumeric characters, optionally separated by single hyphens, must start with a lowercase letter'
    },
    length: {
      minimum: 2,
      maximum: 64,
      tooShort: 'too short (minimum is %{count} characters)',
      tooLong: 'too long (maximum is %{count} characters)'
    },
    getUsernameAvailability: true
  },
  email: {
    presence: { allowEmpty: false },
    email: { message: 'not a valid email address' },
    format: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'may only be a valid email'
    },
    length: {
      minimum: 2,
      maximum: 64,
      tooShort: 'too short (minimum is %{count} characters)',
      tooLong: 'too long (maximum is %{count} characters)'
    },
    getEmailAvailability: true
  },
  password: {
    presence: { allowEmpty: false },
    length: {
      minimum: 8,
      maximum: 64,
      tooShort: 'too short (minimum is %{count} characters)',
      tooLong: 'too long (maximum is %{count} characters)'
    }
  },
  passwordConfirm: {
    presence: { allowEmpty: false },
    equality: {
      attribute: 'password',
      message: 'passwords do not match'
    }
  }
}

module.exports = constraints
