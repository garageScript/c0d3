const socketio = require('socket.io')
const { Room } = require('../dbload')

let io, general
const generalUsers = {}

// Users is userId -> socket, socketUsers is socketId -> userId
const socketUsers = {}

const roomUsers = {}
const roomSockets = {}
const realtime = {}

const mobileUsers = {}

const getAllUsers = () => {
  return Object.values(roomUsers).reduce((acc, usersInRoom) => {
    Object.entries(usersInRoom).forEach(([userId, sockets]) => {
      acc[userId] = true
    })
    return acc
  }, {})
}

const setupRoom = (io, r) => {
  roomUsers[r] = {}
  const nsp = io.of(`/rooms/${r}`)
  nsp.on('connection', socket => {
    socket.on('presence', userId => {
      socketUsers[socket.id] = userId
      const userSockets = roomUsers[r][userId] || {}
      userSockets[socket.id] = true
      roomUsers[r][userId] = userSockets
      nsp.emit('userJoined', Object.keys(realtime.getUsersForRoom(r)))
    })
    socket.on('room', data => {
      io.emit('room', data)
    })
    socket.on('user', data => {
      io.emit('user', data)
    })
    socket.on('message', data => {
      io.emit('message', data)
    })
    socket.on('disconnect', () => {
      const userId = socketUsers[socket.id]
      delete socketUsers[socket.id]
      if (roomUsers[r][userId] && roomUsers[r][userId][socket.id]) {
        delete roomUsers[r][userId][socket.id]
        if (!Object.keys(roomUsers[r][userId]).length) {
          delete roomUsers[r][userId]
        }
      }
      socket.broadcast.emit(
        'userLeft',
        Object.keys(realtime.getUsersForRoom(r))
      )
    })
  })
  roomSockets[r] = nsp
  return nsp
}

realtime.init = function (server) {
  io = socketio(server, {
    pingTimeout: 60000
  })
  general = io.of('/general')
  general.on('connection', socket => {
    const { userId, type } = socket.handshake.query
    /* TODO: change to array or object, since each user
        could have multiple devices. Also, there could
        be a potential bug here. I join with 2 tabs,
        the previous tab's socket gets overwritten
    */
    if (type === 'mobile') {
      mobileUsers[userId] = socket
    } else {
      generalUsers[userId] = socket
    }
    socket.on('disconnect', () => {
      /* Because of the above potential bug, we are not
       * deleting generalUsers because its very common to have
       * multiple tabs open (general). However, its uncommon to have
       * multiple mobile devices on the chatroom app
       */
      delete mobileUsers[userId]
    })
  })
  Room.all().then(rooms =>
    rooms.forEach(r => {
      setupRoom(io, r.id)
    })
  )
}

realtime.createRoom = (userId, room) => {
  realtime.createNewRoom(room)
  if (!generalUsers[userId]) return // If user is not in room
  generalUsers[userId].emit('general', {
    type: 'newRoom',
    room
  })
}

realtime.createNewRoom = room => {
  if (!roomSockets[room.id]) {
    setupRoom(io, room.id)
  }
}

realtime.deleteRoom = roomId => {
  general.emit('general', {
    type: 'deleteRoom',
    roomId
  })
}

realtime.createMessage = (message, userRooms, tmpId) => {
  const roomSocket = roomSockets[message.roomId]
  roomSocket.emit('newMessage', { ...message.dataValues, tmpId })
  userRooms.forEach(userRoom => {
    /* TODO: potential bug with multiple tabs, mentioned before
    */
    const notificationSocket = generalUsers[userRoom.userId]
    if (!notificationSocket || userRoom.userId == message.userId) return
    notificationSocket.emit('general', {
      type: 'newMessage',
      roomId: message.roomId,
      message
    })
  })
}

realtime.getUsers = () => {
  return getAllUsers()
}

realtime.getUsersForRoom = rid => roomUsers[rid]

module.exports = realtime
