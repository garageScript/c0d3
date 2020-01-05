const validate = require('.')

jest.mock('./username')
describe('username validation', () => {
  it('validator resolves to null for valid username', () => {
    const validUsername = 'brian-o-connor'
    return expect(
      validate.validators.userNameIsAvailable(validUsername)
    ).resolves.toBeNull()
  })
  it('validator resolves to be unavailable for a short username', () => {
    const shortUsername = ''
    return expect(
      validate.validators.userNameIsAvailable(shortUsername)
    ).resolves.toBe('unavailable')
  })
  it('validator resolves to be unavaible for usernames with capital letters', () => {
    const capitalUsername = 'BrianOconnor'
    return expect(
      validate.validators.userNameIsAvailable(capitalUsername)
    ).resolves.toBe('unavailable')
  })
})

jest.mock('./email')
describe('email validation', () => {
  it('validator resolves to be null for valid email', () => {
    const validEmail = 'fun@c0d3.com'
    return expect(
      validate.validators.emailIsAvailable(validEmail)
    ).resolves.toBeNull()
  })
  it('validator resolves to unavailable of it is too short', () => {
    const shortEmail = ''
    return expect(
      validate.validators.emailIsAvailable(shortEmail)
    ).resolves.toBe('unavailable')
  })
  it('validator resolves to umavailable if it is too long', () => {
    const tooLongEmail =
      'P2uIek5nERLhuWEq4yXoOQQ9gBWB4Ld3InOIa9g32234234224234J2CONPw8yuDBgH5Eiidbh@hotmail.com'
    return expect(
      validate.validators.emailIsAvailable(tooLongEmail)
    ).resolves.toBe('unavailable')
  })
  it('validator should reject if it does not match an email format', () => {
    const invalidEmail = 'something.com'
    return expect(
      validate.validators.emailIsAvailable(invalidEmail)
    ).resolves.toBe('unavailable')
  })
})
