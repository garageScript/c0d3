const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf, colorize } = format
const morgan = require('morgan')
const chalk = require('chalk')

const netLogger = new createLogger({
  format: combine(
    label({ label: 'network' }),
    colorize(),
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(
      ({ timestamp, level, label, message }) =>
        chalk`{bold ${timestamp}} ${level} {magenta [${label}]}: ${message}`
    )
  ),
  transports: [new transports.Console()],
})

const errorLogs = (logFormat = 'short') => {
  return morgan(logFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: { write: (message) => netLogger.error(message) }
  })
}

const successLogs = (logFormat = 'short') => {
  return morgan(logFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: { write: (message) => netLogger.info(message) }
  })
}

module.exports = [errorLogs(), successLogs()]
