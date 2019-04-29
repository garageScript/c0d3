const bcrypt = require('bcrypt')
const form = require('./lib/form')
const gitLab = require('./lib/helpers')
const matterMostService = require('./lib/matterMostService')
const axios = require('axios')
const { User } = require('../dbload')
const log = require('../log/index')(__filename)
const mailGun = require('../mailGun/index')
const nanoid = require('nanoid')

const errorHandler = (req, res, error) => {
  if (error.httpStatus && error.message) {
    // required header for 401 responses
    if (error.httpStatus === 401) {
      return res
        .status(error.httpStatus)
        .json({ success: false, errorMessage: error.message })
    }
    return res
      .status(error.httpStatus)
      .json({ success: false, errorMessage: error.message })
  }
  return res.status(500).json({ success: false, errorMessage: error })
}

const helpers = {}

helpers.getSession = (req, res) => {
  if (req.user && req.user.id) { return res.json({ success: true, userInfo: req.user }) }
  errorHandler(req, res, { httpStatus: 401, message: 'unauthorized' })
}

helpers.getSignout = (req, res) => {
  req.logout()
  res.status(200).end()
}

// handle registration requests
helpers.postSignup = async (req, res, next) => {
  try {
    // validate inputs
    const validation = await form.isValid('signUp', req.body, 'server')
    if (validation.errors) { throw { httpStatus: 401, message: validation.errors } }

    // add new user info to the database
    const { name, username, confirmEmail, password } = req.body
    const randomToken = nanoid()

    // Sign up user to mattermost and gitlab
    try {
      log.info(`Before signup`)
      const gitLabUser = await gitLab.createUser({ name, username, email: confirmEmail, password })
      log.info(`Signup for gitlab successful: ${gitLabUser}`)
      const mattermostUser = await matterMostService.signupUser(username, password, confirmEmail)
      log.info(`Signup for mattermost sucessful: ${mattermostUser}`)
    } catch (err) {
      log.error(`Signup for mattermost or gitlab failed: ${err}`)
      errorHandler(req, res, { httpStatus: 404, message: 'Signup failed for gitlab or mattermost' })
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const userRecord = await User.create({
      name,
      username,
      password: hash,
      email: confirmEmail,
      emailVerificationToken: randomToken
    })

    // Send email verification
    await mailGun.sendEmailVerifcation({ username, email: confirmEmail }, randomToken)

    // create SSH account if environment is in production
    if (process.env.NODE_ENV === 'production') {
      const newSshAccountReq = await axios.post(
        process.env.SUDO_URL + '/users',
        {
          password,
          username,
          name
        }
      )
      if (!newSshAccountReq.data.success) { throw { httpStatus: 500, message: 'unable to create SSH account' } }
    }

    req.user = userRecord.dataValues
    next()
  } catch (err) {
    errorHandler(req, res, err)
  }
}

// respond to queries about the existence of a given username
helpers.getUsername = async (req, res) => {
  const { username } = req.params
  try {
    const userRecord = await User.findOne({
      where: { username }
    })
    res.status(200).json({
      userName: username,
      exists: !!userRecord
    })
  } catch (error) {
    res.status(500).json({ username, error })
  }
}

// respond to queries for user account names
helpers.postNames = async (req, res) => {
  res.status(200).json([])
  /* TODO: ENABLE when properly secure (ie no passwords)
  const { authKeyName, authKeyValue, ids } = req.body
  try {
    // Validate AUTH KEYS to make sure requests are handled by allowed realms
    const records = await User.findAll({
      where: { id: ids }
    })
    res.status(200).json(records)
  } catch (error) {
    if (error === 'Authentication Failed') {
      res.append('WWW-Authenticate', 'Basic, realm="c0d3.com"') // required header for 401 responses
      res.status(401).json({ error })
    }
    res.status(400).json({ error })
  }
  */
}

const resetPasswordHelper = async (userInfo, newPassword) => {
  // Gitlab accounts - This validates password constraints (min length, chars, etc)
  try {
    log.info(`Before password change`)
    const gitLabUser = await gitLab.changePasswordOrCreateUser(userInfo, newPassword)
    log.info(`Password change for gitlab successful: ${gitLabUser}`)
    const mattermostUser = await matterMostService.changePasswordOrCreateUser(userInfo, newPassword)
    log.info(`Password change for mattermost successful: ${mattermostUser}`)
  } catch (glErr) {
    log.error(`Password change for mattermost or gitlab failed: ${glErr}`)
    throw { httpStatus: 401, message: { gitlab: JSON.stringify(glErr.response.data) } }
  }

  // change SSH account if environment is in production
  if (process.env.NODE_ENV === 'production') {
    const newSshAccountReq = await axios.post(process.env.SUDO_URL + '/password', {
      password: newPassword,
      username: userInfo.username
    })
    if (!newSshAccountReq.data.success) { throw { httpStatus: 500, message: 'unable to create SSH account' } }
  }

  // replace the password hash
  const salt = await bcrypt.genSalt(10)
  const newHash = await bcrypt.hash(newPassword, salt)
  userInfo.update({
    password: newHash
  })
}

helpers.postPassword = async (req, res) => {
  try {
    // get user id if session is active, else reject with 401
    if (!req.user.id) { throw { httpStatus: 401, message: 'sign in required' } }

    // validate that inputs have been received
    const { currPassword, newPassword } = req.body
    if (!currPassword || !newPassword) {
      throw {
        httpStatus: 400,
        message: 'currPassword and newPassword are required parameters'
      }
    }

    const { id } = req.user

    // validate the curent password
    const userInfo = await User.findOne({
      where: { id }
    })
    if (!userInfo) { throw { httpStatus: 401, message: { id: ['invalid'] } } }

    const currHash = userInfo.password
    const pwIsValid = await bcrypt.compare(currPassword, currHash)
    if (!pwIsValid) { throw { httpStatus: 401, message: { currPassword: ['invalid'] } } }

    await resetPasswordHelper(userInfo, newPassword)

    // respond with a success status
    res.status(204).end()
  } catch (error) {
    errorHandler(req, res, error)
  }
}

helpers.forgotResetPassword = async (forgotToken, newPassword, userInfo) => {
  try {
    log.info(`Get userInfo given token`)

    if (!userInfo) {
      log.error('UserInfo does not exist')
      throw { httpStatus: 401, message: { id: ['invalid'] } }
    }

    await resetPasswordHelper(userInfo, newPassword)

    log.info('Password unpdated successfully')
  } catch (error) {
    log.error(`Password reset failed ${error}`)
  }
}

helpers.postValidate = async (req, res) => {
  try {
    const { formName, fieldInputs, context } = req.body
    const result = await form.isValid(formName, fieldInputs, context)
    res.json({ success: true, result: result.errors || '' })
  } catch (err) {
    errorHandler(req, res, err)
  }
}

helpers.postClientForm = async (req, res) => {
  try {
    const { formName } = req.body
    if (!form.defs[formName]) {
      throw {
        httpStatus: 400,
        errorMessage: `form '${form}' does not exist`
      }
    }
    res.json({
      success: true,
      result: form.defs[formName].fields.map(field => {
        delete field.constraints
        return field
      })
    })
  } catch (err) {
    errorHandler(req, res, err)
  }
}

helpers.confirmEmail = async (req, res) => {
  try {
    log.info(`Before email confirmation`)
    User.findOne({ where: { emailVerificationToken: req.params.token } }).then((user) => {
      if (!user) {
        log.info(`User not found ${!user}`)
        return res.redirect(`${process.env.CLIENT_URL}/signin`)
      }
      if (!user.emailVerificationToken) {
        log.info(`Email confirmation invalid ${!user.emailVerificationToken}`)
        return res.redirect(`${process.env.CLIENT_URL}/signin`)
      }
      user.update({ emailVerificationToken: '' })
      log.info(`Email confirmation successful ${user}`)
      return res.send(`
        <h3 style="margin-top: 50px">
          Your email has been confirmed. Please go back to <a href="${process.env.CLIENT_URL}/signin">c0d3.com</a> and sign in. Redirecting in 5 seconds...
        </h3>
        <script>
        setTimeout( () => {
            window.location = "${process.env.CLIENT_URL}/signin"
        }, 5000)
        </script>
        `)
    })
  } catch (err) {
    log.error(`Email confirmation not successful ${err}`)
    res.send('Your email was not confirmed')
  }
}

module.exports = helpers
