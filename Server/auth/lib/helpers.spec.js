/* global describe, it, expect */

process.env.GITLAB_PTOKEN = 'testptoken'
process.env.GITLAB_BASE_URL = 'https://t.c.c/api/v2'

const helpers = require('./helpers')

describe('gitLab url', () => {
  it('should return correct url with no extra path', () => {
    const result = helpers.url()
    expect(result).toEqual('https://t.c.c/api/v4/users/?private_token=testptoken')
  })
  // TODO: test extra path
})
