const { Expo } = require('expo-server-sdk')
const expo = new Expo()

const pushNotification = {}

const users = {}

pushNotification.addTokens = ({ token, userInfo, platform }) => {
  const userTokens = users[userInfo.id] || { userInfo, tokens: {} }
  userTokens.tokens[token.value] = { platform }
  users[userInfo.id] = userTokens
}

pushNotification.send = (userId, body) => {
  // TODO: Do not notify user if they already have their apps open
  const tokens = (users[userId] || {}).tokens
  if (!tokens) return
  const messages = []
  Object.keys(tokens).forEach(v => {
    if (!Expo.isExpoPushToken(v)) { return console.log(`Push token ${v} is not a valid Expo push token`) }
    messages.push({
      to: v,
      sound: 'default',
      body
      // data: { withSome: 'data' },
    })
  })

  let chunks = expo.chunkPushNotifications(messages)
  chunks.forEach(c => {
    expo.sendPushNotificationsAsync(c)
  })
}

module.exports = pushNotification
