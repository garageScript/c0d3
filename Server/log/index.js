const { createLogger, format, transports } = require('winston')
const { combine, timestamp, label, printf, colorize } = format
const { basename } = require('path')
const chalk = require('chalk')

const log = filename =>
  new createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: combine(
      label({ label: basename(filename) }),
      colorize(),
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      printf(
        ({ timestamp, level, label, message }) =>
          chalk`{bold ${timestamp}} ${level} {blue [${label}]}: ${message}`
      )
    ),
    transports: [new transports.Console()],
  })

// Importing Instructions: Call the function with __filename
// const log = require('path/to/log')(__filename)
module.exports = log
