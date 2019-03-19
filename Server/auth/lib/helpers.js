require('dotenv').load()
const axios = require('axios')
const { URL, URLSearchParams } = require('url')

const private_token = process.env.GITLAB_PTOKEN
const gitLab = {
  url: (extraPath = '') => {
    const url = new URL('/api/v4/users/' + extraPath, process.env.GITLAB_BASE_URL)
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

  findOrCreate: async (
    { username, password, email, name },
    url = gitLab.url()) => {
    const find = await gitLab.getUser(username)
    if (find) return find
    return gitLab.createUser({ username: username, password: password, email: email, name: name })
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

  changePassword: async (userName, password) => {
    const userInfo = await gitLab.getUser(userName)
    const url = gitLab.url(`/${userInfo.id}`)
    const response = await axios.put(`${url}`, {
      password,
      skip_reconfirmation: true
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
