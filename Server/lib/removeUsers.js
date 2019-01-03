const { exec } = require('child_process')
const axios = require('axios')
const fs = require('fs')

const serverUrl = 'https://auth-dev.garagescript.org'

/*
 * Helper function - Makes sure jobs run one after another in a serial manner
 */
const serial = { jobs: [] }
serial.add = job => {
  if (!job) return
  if (serial.running) return serial.jobs.push(job)
  serial.run(job)
}
serial.run = job => {
  serial.running = true
  job(() => {
    serial.running = false
    serial.run(serial.jobs.pop())
  })
}

/*
 * Helper function - Gets username from long system prompt
 */
const getUsername = (str, i = 0, result = '') => {
  if (i >= str.length || str[i] === ' ') return result
  return getUsername(str, i + 1, result + str[i])
}

const exceptions = ['gitlab-runner', 'git']

new Promise((resolve, reject) => {
  exec(
    'lastlog | more | grep -v Jun | grep -v Jul | grep -v May',
    (error, stdout, stderr) => {
      if (error) return reject(error)
      if (stderr) return reject(stderr)

      const usersInfo = stdout.split('\n')
      const users = usersInfo
        .map((user, key) => {
          if (!user) return ''
          return getUsername(user).trim()
        })
        .filter(u => u.length && exceptions.indexOf(u) < 0)

      Promise.all(
        users.map(user =>
          axios(`${serverUrl}/usernames/${user}`).then(res => res.data)
        )
      )
        .then(res => res.filter(d => d.exists))
        .then(deleteUsers)
    }
  )
})

const deleteUsers = userInfo => {
  fs.writeFile(
    __dirname + '/deletedUsers2.txt',
    JSON.stringify(userInfo, null, 2),
    () => {}
  )
  const usernames = userInfo.map(ui => ui.userName)
  usernames.forEach(user => {
    serial.add(cb => {
      exec(`sudo userdel -r ${user}`, (error, stdout, stderr) => {
        console.log('RESULT OF DELETING ', user)
        console.log('error', error)
        console.log('stderr', stderr)
        console.log(stdout)
        cb()
      })
    })
  })
}
