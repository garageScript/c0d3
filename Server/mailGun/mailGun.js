const mailgun = require('mailgun-js')({ apiKey: process.env.MAIL_API_KEY, domain: process.env.MAIL_DOMAIN })
const log = require('../log/index')(__filename)

const emailService = {}

emailService.sendPasswordResetEmail = async (email, randomToken) => {
  try {
    await mailgun.messages().send({
      from: '<help.c0d3@gmail.com>',
      to: email,
      subject: 'Forgot Password',
      text: `Click on this link to change your password: ${process.env.CLIENT_URL}/resetPassword/${randomToken}`
    }, (error, body) => {
      log.error(`error sending email ${error}`)
      log.info(`body of email ${body}`)
    })
  } catch (error) {
    log.error(`mailgun did not send email successful ${error}`)
  }
}

module.exports = emailService
