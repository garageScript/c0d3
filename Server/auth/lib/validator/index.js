const validate = require('validate.js')
const constraints = require('../constraints')
const isAvailable = require('./username')

validate.validators.userNameIsAvailable = value => {
  return new validate.Promise((resolve, reject) => {
    // prevent expensive web call if basic constraints are violated
    if (
      value.length < constraints.userName.length.minimum ||
      value.length > constraints.userName.length.maximum ||
      !value.match(constraints.userName.format.pattern)
    ) { return resolve('unavailable') }

    isAvailable(value)
      .then(result => resolve(result ? null : 'unavailable'))
      .catch(err =>
        reject({
          userName: [
            `error: currently unable to validate availability this user name`
          ]
        })
      )
  })
}

module.exports = validate
