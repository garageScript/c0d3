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
  changePasswordOrCreateUser: async ({ username, email }, newPassword, currPassword) => {
    try {
      const userInfo = await matterMostService.getUserInfo(username)
      if (!userInfo || !userInfo.data || !userInfo.data.id) {
        return matterMostService.signupUser(username, newPassword, email)
      }
      return matterMostService.changePassword(username, currPassword, newPassword)
    } catch (error) {
      console.log('Error changing password with Matter Most API')
    }
  },
  changePassword: async (userName, currPassword, newPassword) => {
    try {
      const userInfo = await matterMostService.getUserInfo(userName)
      await axios.put(`${chatServiceUrl}/users/${userInfo.data.id}/password`, {
        'new_password': newPassword
      }, { headers: chatServiceHeader })
    } catch (error) {
      console.log('Error changing password with Matter Most API')
    }
  }
}

module.exports = matterMostService
