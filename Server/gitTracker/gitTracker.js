const { promisify } = require('util')
const request = promisify(require('request'))
// TODO: replace gitLab token with a generic admin user's token
const gitLabApiToken = process.env.GITLAB_PTOKEN
const gitLabApiBaseUrl = process.env.GITLAB_BASE_URL

const helpers = {}

const gitLabMRs = (authorId, after, before, page = 1, mrData = []) => {
  const baseUrl = `${gitLabApiBaseUrl}merge_requests/`
  const tokenParams = `private_token=${gitLabApiToken}`
  const userParams = `author_id=${authorId}&scope=all`
  const timeParams = `created_before=${before}&created_after=${after}`
  const pageParams = `per_page=1000&page=${page}`
  const url = `${baseUrl}?${tokenParams}&${userParams}&${timeParams}&${pageParams}`
  return request(url)
    .then(response => {
      const resData = JSON.parse(response.body)
      return resData.length === 0
        ? mrData
        : gitLabMRs(authorId, after, before, page + 1, mrData.concat(resData))
    })
    .catch(error => [])
}

const gitLabUserId = username => {
  const baseUrl = `${gitLabApiBaseUrl}users/`
  const tokenParams = `private_token=${gitLabApiToken}`
  const userParams = `username=${username}`
  const url = `${baseUrl}?${tokenParams}&${userParams}`
  return request(url)
    .then(response => JSON.parse(response.body)[0].id)
    .catch(error => 0)
}

helpers.getMergeRequests = async (req, res) => {
  try {
    const { username, created_after, created_before } = req.body
    const userId = await gitLabUserId(username)
    const mrData = await gitLabMRs(userId, created_after, created_before)
    res.json(mrData)
  } catch (error) {
    console.log(`gitTracker error: ${error}`)
    res.status(500).json([])
  }
}

module.exports = helpers
