/* global describe, it, expect, jest */

process.env.GITLAB_PTOKEN = 'testptoken'
process.env.GITLAB_BASE_URL = 'https://t.c.c/api/v2'

jest.mock('axios')

const gitLab = require('./helpers')

describe('gitLab url', () => {
  it('should return correct url with no extra path', () => {
    const result = gitLab.url()
    expect(result).toEqual('https://t.c.c/api/v4/users/?private_token=testptoken')
  })
  // TODO: test extra path
})

describe('getUser', () => {
  const email = 'helper2'
  const axios = require('axios')
  it('should send request to the correct url', () => {
    axios.get = jest.fn()
    gitLab.getUser(email)
    expect(axios.get.mock.calls[0][0]).toEqual(
      `https://t.c.c/api/v4/users/?private_token=testptoken&search=${email}&per_page=100`
    )
  })
  it('should return the correct result', async () => {
    axios.get = jest.fn().mockReturnValue({ data: [132] })
    const result = await gitLab.getUser(email)
    expect(result).toEqual(132)
  })
  it('should return undefined if no result', async () => {
    axios.get = jest.fn().mockReturnValue({})
    const result = await gitLab.getUser(email)
    expect(result).toEqual(undefined)
  })
  // TODO: catch errors
  // TODO: user not found
})

describe('data', () => {
  const axios = require('axios')
  it('should return empty array when response data is empty', async () => {
    axios.get = jest.fn(() => {
      return {
        data: []
      }
    })
    const result = await gitLab.data('', 1, [])
    expect(result).toEqual([])
  })
})
