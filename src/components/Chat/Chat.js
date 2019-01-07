import React from 'react'
import { withRouter } from 'react-router'
import '../../css/Chat.css'
import ChatInput from './ChatInput'
import ChatBody from './ChatBody'
// import ChatSearch from './ChatSearch';
import chatdb from '../../db/chatdb'
import { ChatModal } from './ChatModals'
import '../../helpers/gsLength'
import ChatUsersOnline from './ChatUsersOnline'
import GetUserRooms from './ChatRoomsJoined'
import { CHAT_MODAL, CHAT, ROOM_INFO } from './queries'
import { Query } from 'react-apollo'
import { loadComponent } from '../shared/shared'

const ModalButton = ({
  text,
  type,
  renderType = 'button',
  styleClass = 'btn btn-sm btn-secondary',
  customStyle
}) => (
  <Query query={CHAT_MODAL}>
    {clientState => {
      const style = {
        ...(customStyle || {}),
        marginLeft: '10px',
        cursor: 'pointer'
      }
      const clickFun = () => {
        clientState.client.writeData({
          data: { chatModal: type }
        })
      }
      if (renderType === 'button') {
        return (
          <button type='button' className={styleClass} onClick={clickFun}>
            {text}
          </button>
        )
      }
      if (renderType === 'icon') { return <i className={text} style={style} onClick={clickFun} /> }
      return (
        <span style={style} onClick={clickFun}>
          {text}
        </span>
      )
    }}
  </Query>
)

const ChatRoomBar = ({ roomInfo = {}, roomId = '' }) => {
  const editable = roomInfo.isEditable // TODO: testing logic
  let chatRoomBarButtons = editable ? (
    <span className='bar-buttons'>
      <ModalButton
        text='Edit Room'
        type='showEditModal'
        styleClass='btn btn-sm btn-mdb'
      />
      <ModalButton
        text='Add Users'
        type='showAddModal'
        styleClass='btn btn-sm btn-primary'
      />
      <ModalButton
        text='Leave Room'
        type='showLeaveModal'
        styleClass='btn btn-sm btn-secondary'
      />
    </span>
  ) : null
  // TO remove when feature is ready
  chatRoomBarButtons = [1, 5, 22, 23, 24, 25, 26, 29, 30, 31, 32, 33].includes(
    roomInfo.id
  ) ? (
      ''
    ) : (
      <span className='bar-buttons'>
        <ModalButton
          text='fa fa-trash-o'
          renderType='icon'
          type='showDeleteRoomModal'
          customStyle={{ color: 'red', opacity: 0.5 }}
        />
      </span>
    )

  return (
    <div className='top-header'>
      <div style={{ marginLeft: '10px' }}>
        <h2>
          {roomInfo.name}
          {chatRoomBarButtons}
        </h2>
        <p>{roomInfo.description}</p>
      </div>
    </div>
  )
}

const Chat = ({ match }) => {
  // TODO: Fix this no connection modal for actual no
  // server response / websocket connection errors
  // This ultimately blocks the user from doing
  // anything when the is_active call didn't return in time.
  // This race condition just makes the app unusable
  // just because getActiveUsers for your own self didn't
  // come back from the database before the component mounts
  /*
    const noConnection = !this.props.userInfo.is_active ? (
      <NoConnectionModal />
    ) : null;
    */

  const roomId = `${match.params.id}`
  const variables = { input: { id: roomId } }
  return (
    <Query query={CHAT}>
      {loadComponent(chatData => {
        return (
          <Query query={ROOM_INFO} variables={variables}>
            {loadComponent((roomData, _, refetch) => {
              chatdb.setRoomInfo(ROOM_INFO, variables)
              return (
                <div className='container-fluid chat'>
                  <ChatModal />
                  <div className='chat-container'>
                    <div className='left-sidebar scrollbar-chat text-light text-darken-2'>
                      <div className='top-header'>
                        <h1>
                          <a style={{ color: 'white' }} href='/home'>
                            C0D3
                          </a>
                        </h1>
                      </div>
                      <h2 className='chat-header'>
                        Channels
                        <ModalButton
                          renderType='icon'
                          text='fa fa-plus-circle'
                          type='showJoinModal'
                        />
                      </h2>
                      <GetUserRooms
                        channelOnly
                        roomId={roomId}
                        refetch={refetch}
                      />
                      <h2 className='chat-header' style={{ marginTop: '30px' }}>
                        Direct Message
                        <ModalButton
                          renderType='icon'
                          text='fa fa-plus-circle'
                          type='showDirectModal'
                        />
                      </h2>
                      <GetUserRooms
                        channelOnly={false}
                        roomId={roomId}
                        refetch={refetch}
                      />
                      <div style={{ height: '50px' }} />
                    </div>
                    <div className='center-column'>
                      <ChatRoomBar
                        roomId={roomId}
                        roomInfo={roomData.roomInfo || {}}
                      />
                      <ChatUsersOnline roomId={roomId} />
                      <ChatBody
                        editMessage={() => {}}
                        deleteMessage={() => {}}
                        roomId={roomId}
                      />
                      <ChatInput roomId={roomId} ref='child' />
                    </div>
                  </div>
                </div>
              )
            })}
          </Query>
        )
      })}
    </Query>
  )
}

const ChatComp = withRouter(Chat)

export default ChatComp
