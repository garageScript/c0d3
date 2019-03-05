const bcrypt = require('bcrypt')
const form = require('./lib/form')
const gitLab = require('./lib/helpers')
const matterMostService = require('./lib/matterMostService')
const axios = require('axios')
const { User } = require('../dbload')

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
helpers.postSignup = async (req, res) => {
  const { fieldInputs } = req.body
  try {
    // validate inputs
    const validation = await form.isValid('signUp', fieldInputs, 'server')
    if (validation.errors) { throw { httpStatus: 401, message: validation.errors } }

    // add new user info to the database
    const { name, userName, confirmEmail, password } = fieldInputs
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await User.create({
      name,
      username: userName,
      password: hash,
      email: confirmEmail
    })

    // create SSH account if environment is in production
    if (process.env.NODE_ENV === 'production') {
      const newSshAccountReq = await axios.post(
        process.env.SUDO_URL,
        {
          password,
          username: userName,
          name
        }
      )
      if (!newSshAccountReq.data.success) { throw { httpStatus: 500, message: 'unable to create SSH account' } }
    }

    // search for the user record with given email
    const userRecord = await User.findOne({
      where: { username: userName }
    })

    // respond with valid session cookie
    const userInfo = {
      auth: true,
      name: userRecord.name,
      email: userRecord.email,
      userName: userRecord.username,
      id: userRecord.id
    }
    matterMostService.signupUser(userName, password, userRecord.email)

    // set session with userInfo
    req.session.userInfo = userInfo

    res.status(200).json({ success: true, userInfo })
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

    const { id } = req.session.userInfo

    // validate the curent password
    const userInfo = await User.findOne({
      where: { id }
    })
    if (!userInfo) { throw { httpStatus: 401, message: { id: ['invalid'] } } }

    const currHash = userInfo.password
    const pwIsValid = await bcrypt.compare(currPassword, currHash)
    if (!pwIsValid) { throw { httpStatus: 401, message: { currPassword: ['invalid'] } } }

    // Gitlab accounts - This validates password constraints (min length, chars, etc)
    const gitLabUserInfo = await gitLab.getUser(userInfo.username)

    if (process.env.NODE_ENV === 'production') {
      try {
        if (!gitLabUserInfo || !gitLabUserInfo.name) {
          const data = await gitLab.createUser({
            email: userInfo.email,
            password: newPassword,
            username: userInfo.username,
            name: userInfo.name
          })
        } else {
          await gitLab.changePassword(gitLabUserInfo.id, newPassword)
        }
      } catch (glErr) {
        throw { httpStatus: 401, message: { gitlab: JSON.stringify(glErr.response.data) } }
      }
    }

    /*
      // Change ssh login credentials
    await axios.post('https://sudostuff.garagescript.org/password', {
      password: newPassword,
      username: userInfo.username
    })
    */

    // replace the password hash
    const salt = await bcrypt.genSalt(10)
    const newHash = await bcrypt.hash(newPassword, salt)
    userInfo.update({
      password: newHash
    })

    // respond with a success status
    res.status(204).end()
  } catch (error) {
    errorHandler(req, res, error)
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

module.exports = helpers
