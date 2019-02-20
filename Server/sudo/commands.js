const express = require('express')
const { exec } = require('child_process')
const app = express()
app.listen(process.env.SUDO_PORT) // to run: sudo SUDO_PORT=# supervisor command.js
app.use(express.urlencoded())
app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

const execHandler = eType => {
  return (error, stdout, stderr) => {
    if (error) {
      console.log(`${eType} error: `, error)
    }
    if (stderr) {
      console.log(`${eType} error: `, stderr)
    }
    if (stdout) {
      console.log(`${eType} output: `, stdout)
    }
  }
}

const sendError = (res, msg) => {
  return res.status(401).json({
    error: {
      message: msg || 'Not all fields are filled in'
    }
  })
}

app.post('/users', (req, res) => {
  const { username, password, name } = req.body
  if (!username || !password || !name) return sendError(res)
  exec(
    `sudo useradd -m -c "${name}" ${username} -s /bin/bash -p $(echo ${password} | openssl passwd -1 -stdin) -d /home/${username}`,
    execHandler('useradd')
  )
  res.json({ success: true })
})

app.post('/password', (req, res) => {
  const { username, password } = req.body
  if (!username || !password) return sendError(res)

  exec(
    `sudo echo "${username}:${password}" | chpasswd`,
    execHandler('pwchange')
  )
  res.json({ success: true })
})

app.get('/', (req, res) => {
  res.send('JavaScript is awesome')
})
