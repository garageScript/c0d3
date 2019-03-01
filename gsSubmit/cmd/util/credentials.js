const path = require('path')
const homeDir = require('os').homedir()
const fs = require('fs')
const prompt = require('prompt')
const axios = require('axios')

module.exports = {
  getCredentials,
  validate,
  save,
}

const credentialsPath = path.join(homeDir, '.c0d3', 'credentials.json')

function getCredentials(dir = credentialsPath) {
  try {
    return Promise.resolve(require(dir))
  } catch (e) {
    return askForUsernamePassword()
  }
}

function askForUsernamePassword() {
  return new Promise((resolve, reject) => {
    const schema = [
      {
        name: 'username',
        required: true,
      },
      {
        name: 'password',
        hidden: true,
        replace: '*',
      },
    ]

    prompt.message = ''
    prompt.start()
    prompt.get(schema, (err, result) => {
      if (err) return reject('Unable to obtain username/password')
      resolve(result)
    })
  })
}

async function validate(credentials, url) {
  try {
    await axios.post(url, {
      userName: credentials.username,
      password: credentials.password,
    })
    return true
  } catch (e) {
    return false
  }
}

async function save(credentials) {
  try {
    createHiddenDir()
    await createCredentialsFile(credentialsPath, credentials.username)
  } catch (e) {
    console.error('Unable to create hidden directory and save credentials')
  }
}

function createHiddenDir() {
  const hiddenDir = path.join(homeDir, '.c0d3')
  if (!fs.existsSync(hiddenDir)) {
    fs.mkdirSync(hiddenDir)
  }
}

function createCredentialsFile(dir = credentialsPath, username) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dir, JSON.stringify({ username, token: 'c0d3' }), err => {
      if (err) return reject('Unable to save credentials')
      resolve()
    })
  })
}
