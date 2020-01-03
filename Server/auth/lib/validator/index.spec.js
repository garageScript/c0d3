const validate = require('./')

jest.mock('./username')

describe('username validation', () => {
  it('validator resolves to null for valid username', () => {
    const validUsername = 'brian-o-connor'
    expect(
      validate.validators.userNameIsAvailable(validUsername)
    ).resolves.toEqual(null)
  })
  it('validator resolves to be unavailable for a short username', () => {
    const shortUsername = ''
    expect(
      validate.validators.userNameIsAvailable(shortUsername)
    ).resolves.toEqual('unavailable')
  })
  it('validator resolves to be unavaible for usernames with capital letters', () => {
    const capitalUsername = 'BrianOconnor'
    expect(
      validate.validators.userNameIsAvailable(capitalUsername)
    ).resolves.toEqual('unavailable')
  })
})

// TODO: Unit test for email validation
describe('email validation', () => {})
