import React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'

import { CHAT } from './queries'
import chatdb from '../../db/chatdb'
import { loadComponent } from '../shared/shared'

const GetUserRooms = ({ channelOnly, roomId, refetch }) => {
  return (
    <Query query={CHAT}>
      {loadComponent(chatData => {
        const chatInfo = chatData.chat || {}
        const rooms = (chatInfo.rooms || [])
          .slice()
          .filter(r => {
            return channelOnly ? !r.name.includes(',') : r.name.includes(',')
          })
          .sort((a, b) => a.id - b.id)
        const roomComponents = rooms.map((room, i) => {
          const roomName = channelOnly
            ? `#${room.name}`
            : room.name
              .replace(`${window.userInfo.userName}`, '')
              .replace(`,`, '')
          // eslint-disable-next-line
          if (room.id == roomId)
            return (
              <div className='custom-room selected text-white' key={i}>
                {roomName}
              </div>
            )
          const badge = room.unread ? (
            <span className='badge badge-primary badge-pill'>
              {room.unread}
            </span>
          ) : (
            ''
          )
          return (
            <Link to={`/chat/${room.id}`} key={i}>
              <div
                onClick={() => {
                  chatdb.markRead(room.id)
                  // update user's last room
                  refetch({ input: { id: room.id } })
                }}
                className='custom-room text-light'
              >
                {roomName}
                {badge}
              </div>
            </Link>
          )
        })

        return <div>{roomComponents}</div>
      })}
    </Query>
  )
}

export default GetUserRooms
