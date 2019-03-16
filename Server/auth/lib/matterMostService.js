require('dotenv').load()
const axios = require('axios')
const accessToken = process.env.MATTERMOST_ACCESS_TOKEN
const chatServiceHeader = { Authorization: `Bearer ${accessToken}` }
let chatServiceUrl = process.env.NODE_ENV === 'production' ? 'https://chat.c0d3.com/api/v4' : 'https://chat-dev.c0d3.com/api/v4'

const matterMostService = {
  signupUser: async (username, password, email) => {
    try {
      await axios.get(`${chatServiceUrl}/users/username/${username}`, { headers: chatServiceHeader })
    } catch (error) {
      await axios.post(`${chatServiceUrl}/users`, { username, password, email }, { headers: chatServiceHeader })
      console.log('Sign up user to MatterMost', error)
    }
  },
  getUserInfo: (userName) => {
    return axios.get(`${chatServiceUrl}/users/username/${userName}`, { headers: chatServiceHeader })
  },
  changePassword: async (userId, currPassword, newPassword) => {
    try {
      await axios.put(`${chatServiceUrl}/users/${userId}/password`, {
        'current_password': currPassword,
        'new_password': newPassword
      }, { headers: chatServiceHeader })
    } catch (error) {
      console.log('Error changing password with Matter Most API')
    }
  }
}

module.exports = matterMostService
