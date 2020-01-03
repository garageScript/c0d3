const validate = require('./')

jest.mock('./username')

describe('username validation', () => {
  it('validator resolves to null for valid username', () => {
    const validUsername = 'brian-o-connor'
    expect.assertions(1)
    expect(
      validate.validators.userNameIsAvailable(validUsername)
    ).resolves.toStrictEqual(null)
  })
  it('validator resolves to be unavailable for a short username', () => {
    const shortUsername = ''
    expect.assertions(1)
    expect(
      validate.validators.userNameIsAvailable(shortUsername)
    ).resolves.toStrictEqual('unavailable')
  })
  it('validator resolves to be unavaible for usernames with capital letters', () => {
    const capitalUsername = 'BrianOconnor'
    expect.assertions(1)
    expect(
      validate.validators.userNameIsAvailable(capitalUsername)
    ).resolves.toStrictEqual('unavailable')
  })
})

// TODO: Unit test for email validation
describe('email validation', () => {})
