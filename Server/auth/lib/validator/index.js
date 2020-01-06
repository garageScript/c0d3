const validate = require('validate.js')
const constraints = require('../constraints')
const isUserAvailable = require('./username')
const isEmailAvailable = require('./email')

validate.validators.getUsernameAvailability = value => {
  return new validate.Promise((resolve, reject) => {
    // prevent expensive web call if basic constraints are violated
    if (
      value.length < constraints.userName.length.minimum ||
      value.length > constraints.userName.length.maximum ||
      !value.match(constraints.userName.format.pattern)
    ) {
      return resolve('unavailable')
    }

    isUserAvailable(value)
      .then(result => resolve(result ? null : 'unavailable'))
      .catch(_ =>
        reject({
          userName: [
            `error: currently unable to validate availability this user name`
          ]
        })
      )
  })
}

validate.validators.getEmailAvailability = value => {
  return new validate.Promise((resolve, reject) => {
    // prevent expensive web call if basic constraints are violated
    if (
      value.length < constraints.email.length.minimum ||
      value.length > constraints.email.length.maximum ||
      !value.match(constraints.email.format.pattern)
    ) {
      return resolve('unavailable')
    }

    isEmailAvailable(value)
      .then(result => {
        resolve(result.length ? 'An email already exist' : null)
      })
      .catch(_ => {
        reject({
          email: [`error: currently unable to validate availability this email`]
        })
      })
  })
}

module.exports = validate
