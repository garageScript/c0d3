import io from 'socket.io-client'
import { ApolloClient } from 'apollo-client'
import gql from 'graphql-tag'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import { ApolloLink } from 'apollo-link'
import { ROOM_INFO, CHAT } from '../components/Chat/queries'
import notify from '../helpers/notification'
import { arrUntil } from '../helpers/helpers'

// TODO: Deprecate BASE_URL when all routes are removed
const CONNECTION_TRIES = 10

const serverDB = process.env.SERVER_URL

const cache = new InMemoryCache()

const stateLink = withClientState({
  cache,
  defaults: {
    starRecipent: '',
    adoptedStudentFilter: false,
    mrFilter: 'open',
    lessonIndex: 0,
    addNew: false,
    componentType: '',
    chatModal: '',
    chatError: '',
    lessonOrder: 500,
    challengeIndex: 0
  }
})

const sendQuery = (query, variables) => client.query({ query, variables })
const sendMutation = (mutation, variables) =>
  client.mutate({ mutation, variables })

const client = new ApolloClient({
  link: ApolloLink.from([
    stateLink,
    new HttpLink({
      credentials: 'include',
      uri: `${serverDB}/graphql`
    })
  ]),
  cache
})

const chatdb = {
  startSocket: userInfo => {
    if (!userInfo.id || chatdb.generalSocket) return
    chatdb.generalSocket = io.connect(`${serverDB}/general`, {
      query: `userId=${userInfo.id}`
    })
    chatdb.generalSocket.on('general', data => {
      switch (data.type) {
        case 'deleteRoom':
          // eslint-disable-next-line
          if (window.location.href.split('/chat/')[1] == data.roomId) {
            return (window.location = `/chat/1`) // Return user to general
          }
          return chatdb.deleteRoom(data.roomId)
        case 'newMessage':
          notify(`${(data.message || {}).content}`)
          return chatdb.updateMessageCount(data.roomId)
        case 'newRoom':
          return chatdb.pushRoom(data.room)
        default:
      }
    })
  },
  getClient: () => client,
  setRoomInfo: (query, variables) => {
    chatdb.caches.roomInfo = { query, variables }
    const roomId = variables.input.id
    if (chatdb.roomSocket.roomId === roomId) return
    if (chatdb.roomSocket.socket) chatdb.roomSocket.socket.close()
    chatdb.roomSocket.roomId = roomId

    chatdb.roomSocket.socket = io.connect(
      `${serverDB}/rooms/${variables.input.id}`,
      {
        reconnectionAttempts: CONNECTION_TRIES
      }
    )
    chatdb.roomSocket.socket.on('connect', () => {
      chatdb.roomSocket.socket.emit('presence', window.userInfo.id)
    })

    const updateUserList = users => {
      if (!chatdb.caches.roomInfo) return
      const data = client.cache.readQuery({
        query: chatdb.caches.roomInfo.query,
        variables: chatdb.caches.roomInfo.variables
      })
      data.roomInfo.users.forEach(u => {
        u.online = users.includes(u.id + '')
      })
      client.writeQuery({ query, variables, data })
    }
    chatdb.roomSocket.socket.on('userJoined', updateUserList)
    chatdb.roomSocket.socket.on('userLeft', updateUserList)

    chatdb.roomSocket.socket.on('newMessage', message => {
      if (!chatdb.caches.roomInfo) return
      chatdb.pushMessage(roomId, message)
    })
  },

  pushMessage: (
    roomId,
    {
      content,
      userId = window.userInfo.id,
      createdAt = new Date(),
      id = Date.now(),
      tmpId
    }
  ) => {
    const variables = { input: { id: roomId } }
    const data = client.cache.readQuery({ query: ROOM_INFO, variables })
    const msg = arrUntil(data.roomInfo.messages, message => {
      return message.id === tmpId
    })
    if (msg) {
      msg.id = id
    } else {
      data.roomInfo.messages.push({
        id,
        createdAt,
        content,
        userId,
        __typename: 'Message'
      })
    }
    client.writeQuery({ query: ROOM_INFO, variables, data })
  },

  updateMessageCount: roomId => {
    const data = client.cache.readQuery({ query: CHAT })
    data.chat.rooms.forEach(r => {
      // eslint-disable-next-line
      if (r.id == roomId && !r.isLastRoom) {
        r.unread = (r.unread || 0) + 1
      }
    })
    client.writeQuery({ query: CHAT, data })
  },

  markRead: roomId => {
    const data = client.cache.readQuery({ query: CHAT })
    data.chat.rooms.forEach(r => {
      // eslint-disable-next-line
      if (r.id == roomId) {
        r.unread = 0
        r.isLastRoom = true
      } else {
        r.isLastRoom = false
      }
    })
    client.writeQuery({ query: CHAT, data })
  },

  pushRoom: roomData => {
    roomData.__typename = 'Room'
    const data = client.cache.readQuery({ query: CHAT })
    const isExistingRoom = data.chat.rooms.reduce((acc, r) => {
      // eslint-disable-next-line
      if (acc || r.id == roomData.id) return true;
      return acc
    }, false)
    if (isExistingRoom) return

    const allRooms = data.chat.rooms.map(r => {
      return { ...r, isLastRoom: false }
    })

    allRooms.push({ ...roomData, isLastRoom: true, unread: 0 })
    data.chat.rooms = allRooms
    client.writeQuery({ query: CHAT, data })
  },

  deleteRoom: roomId => {
    const data = client.cache.readQuery({ query: CHAT })
    const rooms = data.chat.rooms.reduce((acc, r) => {
      // eslint-disable-next-line
      if (r.id != roomId) {
        acc.push(r)
      }
      return acc
    }, [])
    data.chat.rooms = rooms
    client.writeQuery({ query: CHAT, data })
  },

  createRoom: function (roomName, userId, otherUserId) {
    /*
    requests.post(
      `${serverDB}/rooms`,
      { roomName, otherUserId },
      response => {
        const id = JSON.parse(response)
        const room = {
          id,
          name: roomName
        }
        this.addUserToRoom(id, userId)
        this.changeRoom(id, userId)
        if (otherUserId) {
          this.socket.emit('room', {
            type: 'CHAT_ROOM_ADD',
            roomId: id,
            room
          })
          this.addUserToRoom(id, otherUserId)
        } else {
          loader.store.dispatch({
            type: 'CHAT_ROOM_ADD',
            roomId: id,
            room
          })
        }
      }
    )
    */
  },

  editMessage: function (roomId, messageId, content, editedTime) {
    sendMutation(
      gql`
        mutation EditMessage($input: MsgEditInfo) {
          editMessage(input: $input) {
            success
          }
        }
      `,
      {
        input: {
          messageId,
          content,
          editedTime
        }
      }
    ).then(() => {
      this.socket.emit('message', {
        type: 'CHAT_MESSAGE_EDIT',
        roomId,
        messageId,
        content,
        editedTime
      })
    })
  },

  deleteMessage: function (roomId, messageId) {
    sendMutation(
      gql`
        mutation deletePost($messageId: Int, $roomId: Int) {
          deletePost(messageId: $messageId, roomId: $roomId) {
            success
          }
        }
      `,
      { messageId, roomId }
    ).then(() => {
      /*
      loader.store.dispatch({
        type: 'CHAT_MESSAGE_DELETE',
        roomId,
        messageId
      })
      */
    })
  },

  search: function (userId, searchTerm) {
    sendQuery(
      gql`
        query searchItem($userId: Int, $searchTerm: String) {
          searchItem(userId: $userId, searchTerm: $searchTerm) {
            id
            room_id
            user_id
            content
            created_at
            edited_time
            room_name
          }
        }
      `,
      { userId, searchTerm }
    ).then(results => {
      /*
      loader.store.dispatch({
        type: 'CHAT_SEARCH',
        results: results.data.searchItem
      })
      */
    })
  },

  searchClear: function () {
    // loader.store.dispatch({ type: 'CHAT_SEARCH_CLEAR' })
  }
}

chatdb.caches = {}
chatdb.roomSocket = {}

export default chatdb
