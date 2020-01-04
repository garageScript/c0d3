require('dotenv').load()
const axios = require('axios')
const { URL, URLSearchParams } = require('url')

const gitLab = {
  url: (extraPath = '') => {
    const url = new URL('/api/v4/users/' + extraPath, process.env.GITLAB_BASE_URL)
    url.search = new URLSearchParams({ private_token: process.env.GITLAB_PTOKEN })
    return url.toString()
  },

  getUsers: async (url = gitLab.url()) => {
    const response = await axios.get(`${url}&per_page=100000000`)
    return response.data
  },

  getUser: async (email, url = gitLab.url()) => {
    const response = await axios.get(
      `${url}&search=${email}&per_page=100000000`
    )
    return (response.data || [])[0]
  },

  findOrCreate: async (
    { username, password, email, name },
    url = gitLab.url()) => {
    const find = await gitLab.getUser(email)
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

  changePasswordOrCreateUser: async ({ username, name, email }, password) => {
    const userInfo = await gitLab.getUser(email)
    if (!userInfo || !userInfo.id) {
      return gitLab.createUser({
        username, name, email, password
      })
    }
    return gitLab.changePassword(email, password)
  },

  changePassword: async (email, password) => {
    const userInfo = await gitLab.getUser(email)
    const url = gitLab.url(`/${userInfo.id}`)
    const response = await axios.put(`${url}`, {
      password,
      skip_reconfirmation: true
    })
    return response.data
  },

  data: async (url = gitLab.url(), page = 1, data = []) => {
    const response = await axios.get(`${url}&per_page=1000&page=${page}`)
    if (response.data.length === 0) return data
    return gitLab.data(url, page + 1, data.concat(response.data))
  }
}

module.exports = gitLab
