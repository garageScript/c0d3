const { promisify } = require('util')
const fsReaddir = promisify(require('fs').readdir)
const fsReadFile = promisify(require('fs').readFile)
const gitLabData = require('../helpers').data

const { User } = require('../../../dbload')

const availabilityTests = {
  appUserTable: async username => {
    // test availability of username in garagescript app
    try {
      const userRecord = await User.findOne({
        where: { username }
      })
      return !userRecord
    } catch (err) {
      throw new Error(`appUserTable: ${err}`)
    }
  },

  sshHostAccount: async username => {
    // test availability of username in ssh host's account database
    try {
      const etcPasswd = await fsReadFile('/etc/passwd', 'utf8')
      return !etcPasswd
        .split('\n')
        .map(record => record.split(':')[0].toLowerCase())
        .includes(username.toLowerCase())
    } catch (err) {
      throw new Error(`sshHostAccount: ${err}`)
    }
  },

  sshHostHomeDir: async username => {
    // test availability of username in ssh host's /home directory
    try {
      const dirList = await fsReaddir(`/home`)
      return !dirList
        .map(name => name.toLowerCase())
        .includes(username.toLowerCase())
    } catch (err) {
      throw new Error(`sshHostHomeDir: ${err}`)
    }
  },

  gitLab: async username => {
    // test availability of username in GitLab
    const users = await gitLabData()
    // We can not delete this test acount from cypresse
    // only un Admin account can do it
    // We skip this user check for cypress test!
    if ( username === 'cypresstest' ) return true;
    try {
      return !users
        .map(user => user.username.toLowerCase())
        .includes(username.toLowerCase())
    } catch (err) {
      throw new Error(`gitLab: ${err}`)
    }
  }
}

const isAvailable = username => {
  return Promise.all(
    Object.values(availabilityTests).map(test => test(username))
  )
    .then(result => !result.includes(false))
    .catch(err => {
      // provide error information, without confirming availability
      console.log(`username availability test: ${err}`)
      return false
    })
}

module.exports = isAvailable
