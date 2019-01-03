const { Message, UserRoom, Room, User } = require('../../dbload')
const realtime = require('../socket')

const addOnlineProperty = users => {
  const onlineUsers = realtime.getUsers()
  users.forEach(u => {
    if (onlineUsers[u.id]) u.online = true
  })
  return users
}

const Query = {
  chat: (obj, args, context) => {
    const response = {}
    const user = context.user
    return User.findOne({
      where: {
        id: user.id
      },
      include: [
        'lastroom',
        {
          model: Room,
          through: {
            attributes: ['unread', 'isLastRoom']
          }
        }
      ]
    })
      .then(u => {
        response.user = u
        response.rooms = u.rooms || []
        response.user.lastroomId = 1
        response.rooms.forEach(r => {
          r.unread = r.userRoom.unread
          r.isLastRoom = r.userRoom.isLastRoom
          if (r.userRoom.isLastRoom) {
            response.user.lastroomId = r.id
          }
        })
        return User.findAll()
      })
      .then(m => {
        response.users = addOnlineProperty(m || [])
        return response
      })
  },

  rooms: (obj, args) => {
    return Promise.all([
      Room.findAll({ where: { isPrivate: false } }),
      UserRoom.findAll()
    ]).then(([rooms, users]) => {
      const countMap = users.reduce((acc, ur) => {
        acc[ur.roomId] = (acc[ur.roomId] || 0) + 1
        return acc
      }, {})
      return rooms.map(r => {
        return Object.assign({}, r.dataValues, {
          userCount: countMap[r.id] || 0
        })
      })
    })
  },
  roomInfo: (obj, args, context) => {
    UserRoom.findOrCreate({
      where: {
        roomId: args.input.id,
        userId: context.user.id
      }
    }).then(([ur]) => {
      ur.update({
        isLastRoom: true,
        unread: 0
      })
    })
    UserRoom.findAll({
      where: {
        userId: context.user.id
      }
    }).then(rooms => {
      rooms.forEach(r => {
        if (r.id == args.input.id) return
        if (!r.isLastRoom) return
        r.update({ isLastRoom: false })
      })
    })
    return Promise.all([
      Room.findOne({
        where: { id: args.input.id },
        include: ['users']
      }),
      Message.findAll({
        where: { roomId: args.input.id },
        limit: 200,
        order: [['createdAt', 'DESC']]
      })
    ]).then(([r, messages]) => {
      r.users = addOnlineProperty(r.users)
      r.messages = messages.reverse() || []
      return r
    })
  },

  searchItem: (obj, args) => {
    return new Promise((resolve, reject) => {
      /*
      db.query(
        `SELECT message.id, room_id, room.name as room_name, user_id, user.name as user_name, content, created_at, edited_time
    FROM message
    JOIN user ON user_id=user.id
    JOIN room ON room_id=room.id
    WHERE concat(content,user.name) LIKE ?
    AND room_id = ANY (
      SELECT DISTINCT room_id FROM user_room
      JOIN room ON room_id=room.id
      WHERE room.is_private = 0
      OR user_id = ?
    )
    ORDER BY created_at DESC`,
        [`%${args.searchTerm}%`, args.userId],
        (error, results, fields) => {
          if (error) return reject(error);
          return resolve(results);
        }
      );
    */
    })
  }
}

module.exports = Query
