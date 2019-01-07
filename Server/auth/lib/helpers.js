const axios = require('axios')
const { URL, URLSearchParams } = require('url')
const gitLabConf = require('../../config.json').gitLab

const private_token = process.env.PRIVATE_GITHUB || gitLabConf.private_token
const gitLab = {
  url: (extraPath = '') => {
    const { baseUrl, path } = gitLabConf
    const url = new URL(path + extraPath, baseUrl)
    url.search = new URLSearchParams({ private_token })
    return url.toString()
  },

  getUsers: async (url = gitLab.url()) => {
    const response = await axios.get(`${url}&per_page=100000000`)
    return response.data
  },

  getUser: async (username, url = gitLab.url()) => {
    const response = await axios.get(
      `${url}&username=${username}&per_page=100000000`
    )
    return (response.data || [])[0]
  },

  createUser: async (
    { username, password, email, name },
    url = gitLab.url()
  ) => {
    const response = await axios.post(`${url}`, {
      email,
      password,
      username,
      name,
      skip_confirmation: true
    })
    return (response.data || [])[0]
  },

  changePassword: async (userId, password) => {
    const url = gitLab.url(`/${userId}`)
    const response = await axios.put(`${url}`, {
      password,
      skip_confirmation: true
    })
    return (response.data || [])[0]
  },

  data: async (url = gitLab.url(), page = 1, data = []) => {
    const response = await axios.get(`${url}&per_page=1000&page=${page}`)
    if (response.data.length === 0) return data
    return gitLab.data(url, page + 1, data.concat(response.data))
  }
}

module.exports = gitLab
