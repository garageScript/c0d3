const morgan = require('morgan')

const errorLogs = (logFormat = 'combined') => {
  return morgan(logFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: process.stderr
  })
}

const successLogs = (logFormat = 'combined') => {
  return morgan(logFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: process.stdout
  })
}

module.exports = [errorLogs(), successLogs()]
