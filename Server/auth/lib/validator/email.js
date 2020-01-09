const { User } = require('../../../dbload')

const isEmailAvailable = value => User.findAll({ where: { email: value } })

module.exports = isEmailAvailable
