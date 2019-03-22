const mailgun = require('mailgun-js')({ apiKey: process.env.API_KEY, domain: process.env.DOMAIN })
const log = require('../log/index')(__filename)

const emailService = {}

emailService.sendEmail = async (email, randomToken) => {
  try {
    await mailgun.messages().send({
      from: '<help.c0d3@gmail.com>',
      to: email,
      subject: 'Forgot Password',
      text: `Click on this link to change your password: ${process.env.CLIENT_URL}/sendEmail/${randomToken}`
    }, (error, body) => {
      log.error(`error sending email ${error}`)
      log.info(`body of email ${body}`)
      console.log(body)
    })
  } catch (error) {
    log.error(`mailgun did not send email successful ${error}`)
  }
}

module.exports = emailService
