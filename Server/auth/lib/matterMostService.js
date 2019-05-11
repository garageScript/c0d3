const axios = require('axios')
const accessToken = process.env.MATTERMOST_ACCESS_TOKEN
const chatServiceHeader = { Authorization: `Bearer ${accessToken}` }
let chatServiceUrl = process.env.NODE_ENV === 'production' ? 'https://chat.c0d3.com/api/v4' : 'https://chat-dev.c0d3.com/api/v4'

const matterMostService = {
  signupUser: async (username, password, email) => {
    try {
      await axios.get(`${chatServiceUrl}/users/email/${email}`, { headers: chatServiceHeader })
    } catch (error) {
      await axios.post(`${chatServiceUrl}/users`, { username, password, email }, { headers: chatServiceHeader })
    }
  },
  getUserInfo: (email) => {
    return axios.get(`${chatServiceUrl}/users/email/${email}`, { headers: chatServiceHeader })
  },
  changePasswordOrCreateUser: async ({ username, email }, newPassword, currPassword) => {
    try {
      const userInfo = await matterMostService.getUserInfo(email)
      if (!userInfo || !userInfo.data || !userInfo.data.id) {
        return matterMostService.signupUser(username, newPassword, email)
      }
      return matterMostService.changePassword(email, currPassword, newPassword)
    } catch (error) {
      console.log('Error changing password with Matter Most API')
    }
  },
  changePassword: async (email, currPassword, newPassword) => {
    // Becareful as a developer: According to the docs, current password is required
    // if you are updating your own password
    // https://api.mattermost.com/#tag/users%2Fpaths%2F~1users~1%7Buser_id%7D~1password%2Fput
    try {
      const userInfo = await matterMostService.getUserInfo(email)
      await axios.put(`${chatServiceUrl}/users/${userInfo.data.id}/password`, {
        'new_password': newPassword
      }, { headers: chatServiceHeader })
    } catch (error) {
      console.log('Error changing password with Matter Most API')
    }
  },
  getChannelInfo: async (roomName) => {
    const devOrProd = process.env.NODE_ENV === 'production' ? 'c0d3' : 'c0d3-dev'
    return axios.get(`${chatServiceUrl}/teams/name/${devOrProd}/channels/name/${roomName}`, { headers: chatServiceHeader })
  },
  sendMessage: async (channelId, message) => {
    try {
      await axios.post(`${chatServiceUrl}/posts`, {
        'channel_id': channelId,
        'message': message
      }, { headers: chatServiceHeader })
    } catch (error) {
      console.log('Error sending message to mattermost channel')
    }
  },
  findOrCreateDirectMessageChannel: async (submitterEmail, reviewerEmail) => {
    try {
      const [submitter, reviewer] = await Promise.all([
        matterMostService.getUserInfo(submitterEmail),
        matterMostService.getUserInfo(reviewerEmail)
      ])
      return axios.post(`${chatServiceUrl}/channels/direct`, [
        `${submitter.data.id}`,
        `${reviewer.data.id}`
      ], { headers: chatServiceHeader })
    } catch (error) {
      console.log('Error creating direct message channel')
    }
  },
  sendDirectMessage: async (submitterEmail, reviewerEmail, message) => {
    const channelId = await matterMostService.findOrCreateDirectMessageChannel(submitterEmail, reviewerEmail)
    await matterMostService.sendMessage(channelId.data.id, message)
  },
  publicChannelMessage: async (channelName, message) => {
    const channelId = await matterMostService.getChannelInfo(channelName)
    await matterMostService.sendMessage(channelId.data.id, message)
  }
}

module.exports = matterMostService
