const mailgun = require('mailgun-js')({ apiKey: process.env.MAIL_API_KEY, domain: process.env.MAIL_DOMAIN })
const log = require('../log/index')(__filename)

const emailService = {}

emailService.sendInviteEmail = async ({ email }) => {
  try {
    await mailgun.messages().send({
      from: '<hello@c0d3.com>',
      to: email,
      subject: 'Congratulations! You are approved to join C0d3.com',
      text: `Congratulations Noob!, We are super excited for you join our next cohort. Please sign up at https://c0d3.com/signup `
    }, (error, body) => {
      if (error) {
        log.error(`error sending email ${error}`)
      }
      log.info(`body of email ${body}`)
    })
  } catch (error) {
    log.error(`mailgun did not send email successful ${error}`)
  }
}

emailService.sendPasswordResetEmail = async ({ email, username }, randomToken) => {
  try {
    await mailgun.messages().send({
      from: '<hello@c0d3.com>',
      to: email,
      subject: 'Forgot Password',
      text: `Your username is ${username}. Click on this link to change your password: ${process.env.CLIENT_URL}/resetPassword/${randomToken}`
    }, (error, body) => {
      if (error) {
        log.error(`error sending email ${error}`)
      }
      log.info(`body of email ${body}`)
    })
  } catch (error) {
    log.error(`mailgun did not send email successful ${error}`)
  }
}

emailService.sendEmailVerifcation = async ({ email, username }, randomToken) => {
  try {
    await mailgun.messages().send({
      from: '<hello@c0d3.com>',
      to: email,
      subject: 'Email Verifcation',
      text: `Your username is ${username}. Click on this link to verify your email: ${process.env.REACT_APP_SERVER_URL}/confirmEmail/${randomToken}`
    }, (error, body) => {
      if (error) {
        log.error(`error sending email verification ${error}`)
      }
      log.info(`body of email ${body}`)
    })
    log.info(`mailgun sent email verification successfully`)
  } catch (error) {
    log.error(`mailgun did not send email verification successfully ${error}`)
  }
}

module.exports = emailService
