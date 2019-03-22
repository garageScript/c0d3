const bcrypt = require('bcrypt')
const gitLab = require('../Server/auth/lib/helpers')
const matterMostService = require('../Server/auth/lib/matterMostService')
const { User } = require('../dbload')
const log = require('../log/index')(__filename)

const helpers = {}
// Reset password non-auth
helpers.resetPassword = async (forgotToken, newPassword) => {
  try {
    // validate that inputs have been received
    if (!newPassword || !forgotToken) {
      log.error(`newPassword or forgotToken was not received`)
      throw {
        httpStatus: 400,
        message: 'forgotToken and newPassword are required parameters'
      }
    }

    log.info(`Get userInfo given token`)
    // get userinfo given token
    const userInfo = await User.findOne({
      where: { forgotToken: forgotToken }
    })

    if (!userInfo) {
      log.error('UserInfo does not exist')
      throw { httpStatus: 401, message: { id: ['invalid'] } }
    }

    // Gitlab and Mattermost accounts, change password
    try {
      log.info(`Before password change`)
      const gitLabUser = await gitLab.changePasswordOrCreateUser(userInfo, newPassword)
      log.info(`Password change for gitlab successful: ${gitLabUser}`)
      const mattermostUser = await matterMostService.changePasswordOrCreateUser(userInfo, newPassword)
      log.info(`Password change for mattermost successful: ${mattermostUser}`)
    } catch (glErr) {
      log.error(`Password change for mattermost or gitlab failed: ${JSON.stringify(glErr, null, 2)}`)
      throw { httpStatus: 401, message: { gitlab: JSON.stringify(glErr.response.data) } }
    }

    log.info('Before hashing password')
    // replace the password hash
    const salt = await bcrypt.genSalt(10)
    const newHash = await bcrypt.hash(newPassword, salt)
    log.info('After hashing password')

    userInfo.update({
      password: newHash
    })
    log.info('Password unpdated successfully')
  } catch (error) {
    log.error(`Password reset failed ${error}`)
  }
}
