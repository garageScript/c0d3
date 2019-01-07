import React from 'react'
import { Query } from 'react-apollo'

import { ROOM_INFO } from './queries'
import { loadComponent } from '../shared/shared'

class ChatUsersOnline extends React.Component {
  constructor (props) {
    super(props)
    this.state = { isExpanded: false }
  }
  render () {
    return (
      <Query query={ROOM_INFO} variables={{ input: { id: this.props.roomId } }}>
        {loadComponent(({ roomInfo }) => {
          const members = roomInfo.users || []
          const usersOn = members.filter(u => u.online).map(u => (
            <li className='chat-users-online' key={u.id}>
              {u.username}
            </li>
          ))
          const usersOff = members.filter(u => !u.online).map(u => (
            <li className='chat-users-offline' key={u.id}>
              {u.username}
            </li>
          ))
          let bottom = ''
          if (this.state.isExpanded) {
            bottom = (
              <div>
                <ul className='chat-users-list'>{usersOn}</ul>
                <ul className='chat-users-list offline'>{usersOff}</ul>
              </div>
            )
          }
          return (
            <div className={`chat-users-status`}>
              <h5
                className='chat-online-header'
                onClick={() =>
                  this.setState({ isExpanded: !this.state.isExpanded })
                }
              >
                {`Members Online ${usersOn.length} / ${members.length}`}
              </h5>
              {bottom}
            </div>
          )
        })}
      </Query>
    )
  }
}

export default ChatUsersOnline
