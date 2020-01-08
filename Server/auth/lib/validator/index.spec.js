const validate = require('.')

jest.mock('./username')
jest.mock('./email')

const isUserAvailable = require('./username')
isUserAvailable.mockImplementationOnce(() => Promise.reject())
const isEmailAvailable = require('./email')
isEmailAvailable.mockImplementationOnce(() => Promise.reject())

// TODO: rewrite tests for simplify validation functions
describe('username validation', () => {
  it('validator rejects with proper error message', () => {
    const errObj = {
      userName: [
        `error: currently unable to validate availability this user name`
      ]
    }
    const name = 'brian'
    return expect(
      validate.validators.getUsernameAvailability(name)
    ).rejects.toEqual(errObj)
  })
  it('validator resolves to null for valid username', () => {
    const validUsername = 'brian-o-connor'
    return expect(
      validate.validators.getUsernameAvailability(validUsername)
    ).resolves.toBeNull()
  })
  it('validator resolves to be unavailable for a short username', () => {
    const shortUsername = ''
    return expect(
      validate.validators.getUsernameAvailability(shortUsername)
    ).resolves.toBe('unavailable')
  })
  it('validator resolves to be unavaible for usernames with capital letters', () => {
    const capitalUsername = 'BrianOconnor'
    return expect(
      validate.validators.getUsernameAvailability(capitalUsername)
    ).resolves.toBe('unavailable')
  })
})

describe('email validation', () => {
  it('validator rejects with the proper error message', () => {
    const errObj = {
      email: [`error: currently unable to validate availability this email`]
    }
    const email = 'fun@c0d3.com'
    return expect(
      validate.validators.getEmailAvailability(email)
    ).rejects.toEqual(errObj)
  })
  it('validator resolves to be null for valid email', () => {
    const validEmail = 'fun@c0d3.com'
    return expect(
      validate.validators.getEmailAvailability(validEmail)
    ).resolves.toBeNull()
  })
  it('validator resolves to unavailable of it is too short', () => {
    const shortEmail = ''
    return expect(
      validate.validators.getEmailAvailability(shortEmail)
    ).resolves.toBe('unavailable')
  })
  it('validator resolves to umavailable if it is too long', () => {
    const tooLongEmail =
      'P2uIek5nERLhuWEq4yXoOQQ9gBWB4Ld3InOIa9g32234234224234J2CONPw8yuDBgH5Eiidbh@hotmail.com'
    return expect(
      validate.validators.getEmailAvailability(tooLongEmail)
    ).resolves.toBe('unavailable')
  })
  it('validator should reject if it does not match an email format', () => {
    const invalidEmail = 'something.com'
    return expect(
      validate.validators.getEmailAvailability(invalidEmail)
    ).resolves.toBe('unavailable')
  })
})
