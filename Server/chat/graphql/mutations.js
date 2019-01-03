const { Message, Room, User, UserRoom } = require('../../dbload')
const pushNotification = require('../../lib/pushNotification')
const realtime = require('../socket')

const Mutation = {
  editMessage: (obj, args) => {
    return new Promise((resolve, reject) => {
      /*
      db.query(
        'UPDATE message SET content = ?, edited_time = ? WHERE id = ?',
        [args.content, args.editedTime || Date.now(), args.messageId],
        (error, results, fields) => {
          if (error) return reject(error);
          return resolve({ success: true });
        }
      );
      */
    })
  },

  newMessage: (obj, args, context) => {
    const userId = context.user.id
    let msg
    return Room.findOne({ where: { id: args.input.roomId } })
      .then(r => {
        return r.createMessage({
          content: args.input.content,
          userId
        })
      })
      .then(m => {
        msg = m
        return UserRoom.findAll({
          where: {
            roomId: args.input.roomId
          }
        })
      })
      .then(rooms => {
        realtime.createMessage(msg, rooms, args.input.tmpId)
        const activeUsers = Object.keys(
          realtime.getUsersForRoom(args.input.roomId) || {}
        )
        rooms
          .filter(r => {
            const roomUserId = `${r.userId}`
            if (r.userId !== userId) {
              pushNotification.send(
                r.userId,
                `${context.user.userName}: ${args.input.content}`
              )
            }
            return !activeUsers.includes(roomUserId)
          })
          .forEach(r => {
            r.update({
              unread: (r.unread || 0) + 1
            })
          })
        return msg
      })
  },

  leaveRoom: (obj, args, context) => {
    const user = context.user
    return UserRoom.destroy({
      where: {
        roomId: args.input.id,
        userId: user.id
      },
      force: true
    })
  },

  deletePost: (obj, args) => {
    return new Promise((resolve, reject) => {
      /*
      db.query(
        'DELETE FROM message WHERE id = ? AND room_id = ?',
        [args.messageId, args.roomId],
        (error, results, fields) => {
          if (error) return reject(error);
          return resolve({ success: true });
        }
      );
      */
    })
  },

  editRoom: (obj, args, context) => {
    return Room.findOne({ where: { id: args.input.id } }).then(r =>
      r.update({
        name: args.input.name,
        description: args.input.description
      })
    )
  },

  createRoom: (obj, args, context) => {
    const user = context.user
    let room = {}
    const roomData = Object.assign({}, args.input)
    delete roomData.id
    return Room.findOrCreate({ where: roomData })
      .then(([r]) => {
        room = r
        return User.findOne({
          where: {
            id: user.id
          }
        })
      })
      .then(u =>
        u.update({
          lastroomId: room.id
        })
      )
      .then(u => {
        UserRoom.findOrCreate({
          where: {
            userId: u.id,
            roomId: room.id
          }
        })
        realtime.createNewRoom(room)
      })
      .then(_ => room)
  },

  destroyRoom: (obj, args, context) => {
    // const user = context.user; // TODO: check user to make sure he is owner of the room
    return Room.destroy({
      where: { id: args.input.id },
      force: true
    })
      .then(r => {
        return UserRoom.destroy({
          where: { roomId: args.input.id },
          force: true
        })
      })
      .then(r => {
        Message.destroy({
          where: { roomId: args.input.id },
          force: true
        })
        realtime.deleteRoom(args.input.id)
        return r
      })
  },

  directMessageRoom: (obj, args, context) => {
    const user = context.user
    const users = [
      args.input.username.toLowerCase(),
      user.userName.toLowerCase()
    ].sort()
    const name = `${users[0]},${users[1]}`
    let room
    return Room.findOrCreate({
      where: {
        name,
        isEditable: false,
        isPrivate: true
      }
    })
      .then(([r]) => {
        room = r
        realtime.createRoom(args.input.id, room)
        realtime.createRoom(user.id, room)
        UserRoom.findOrCreate({
          where: {
            userId: context.user.id,
            roomId: r.id
          }
        })
        UserRoom.findOrCreate({
          where: {
            userId: args.input.id,
            roomId: r.id
          }
        })
        return User.findOne({
          where: {
            id: user.id
          }
        })
      })
      .then(u =>
        u.update({
          lastroomId: room.id
        })
      )
      .then(u => room)
  },

  joinRoom: (obj, args, context) =>
    UserRoom.findOrCreate({
      where: {
        roomId: args.input.id,
        userId: context.user.id
      }
    })
      .then(() =>
        User.update(
          {
            lastroomId: args.input.id
          },
          { where: { id: context.user.id } }
        )
      )
      .then(() =>
        Room.findOne({
          where: { id: args.input.id }
        })
      )
}

module.exports = Mutation
