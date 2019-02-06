import React, { Component } from 'react'
import { withRouter } from 'react-router'
import { Query, Mutation } from 'react-apollo'

import chatdb from '../../db/chatdb'
import Modal from '../Modal'
import {
  ROOMS,
  CHAT,
  DIRECT_MESSAGE_ROOM,
  LEAVE_ROOM,
  DESTROY_ROOM,
  EDIT_ROOM,
  CHAT_MODAL,
  CREATE_ROOM,
  JOIN_ROOM
} from './queries'
import { loadComponent } from '../shared/shared'

const NoConnectionModal = () => {
  return (
    <Modal>
      <div className='modal-overlay modal-chat-overlay'>
        <div className='modal-content modal-chat-sm'>
          <div className='modal-header'>
            <h5 className='modal-title font-weight-bold'>No Connection</h5>
          </div>
          <div className='modal-body'>Please check back later.</div>
          <div className='modal-chat-loading'>
            <div className='preloader-wrapper small active modal-chat-load'>
              <div className='spinner-layer spinner-blue-only'>
                <div className='circle-clipper left'>
                  <div className='circle' />
                </div>
                <div className='gap-patch'>
                  <div className='circle' />
                </div>
                <div className='circle-clipper right'>
                  <div className='circle' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  )
}

const ChatModalComponent = props => {
  return (
    <Query query={CHAT_MODAL}>
      {clientState => {
        const selected = clientState.data.chatModal || ''
        const dismiss = (next = '') => {
          if (typeof next === 'string') {
            return clientState.client.writeData({
              data: { chatModal: next }
            })
          }
          if (
            typeof next === 'object' &&
            next.target.classList.contains('modal-overlay')
          ) {
            return clientState.client.writeData({
              data: { chatModal: '' }
            })
          }
        }

        const closeButton = (
          <button
            type='button'
            className='close'
            aria-label='Close'
            onClick={() => dismiss()}
          >
            <span aria-hidden='true'>&times;</span>
          </button>
        )

        const cancelButton = (
          <button
            type='button'
            className='btn btn-sm btn-info'
            onClick={() => dismiss()}
          >
            Cancel
          </button>
        )

        let selectedModal = null
        if (selected === 'showJoinModal') {
          selectedModal = (
            <JoinRoomModal
              dismiss={dismiss}
              closeButton={closeButton}
              history={props.history}
            />
          )
        }
        if (selected === 'showDirectModal') {
          selectedModal = (
            <DirectMessageModal
              dismiss={dismiss}
              closeButton={closeButton}
              cancelButton={cancelButton}
              history={props.history}
            />
          )
        }
        if (selected === 'showLeaveModal') {
          selectedModal = (
            <LeaveRoomModal
              dismiss={dismiss}
              {...props}
              closeButton={closeButton}
              cancelButton={cancelButton}
              history={props.history}
            />
          )
        }
        if (selected === 'showAddModal') {
          selectedModal = (
            <AddUserModal
              dismiss={dismiss}
              {...props}
              closeButton={closeButton}
              cancelButton={cancelButton}
            />
          )
        }
        if (selected === 'showEditModal') {
          selectedModal = (
            <EditRoomNameModal
              dismiss={dismiss}
              {...props}
              closeButton={closeButton}
              cancelButton={cancelButton}
            />
          )
        }
        if (selected === 'showDeleteRoomModal') {
          selectedModal = (
            <DeleteRoomModal
              dismiss={dismiss}
              closeButton={closeButton}
              cancelButton={cancelButton}
              history={props.history}
              match={props.match}
            />
          )
        }

        if (selectedModal) {
          return (
            <Modal>
              <div
                className='modal-overlay modal-chat-overlay'
                onClick={dismiss}
              >
                {selectedModal}
              </div>
            </Modal>
          )
        }

        return null
      }}
    </Query>
  )
}
const ChatModal = withRouter(ChatModalComponent)

const CreateRoom = ({ name, dismiss, history }) => (
  <Mutation
    mutation={CREATE_ROOM}
    update={(_, { data }) => {
      chatdb.pushRoom(data.createRoom)
      history.push(`/chat/${data.createRoom.id}`)
    }}
  >
    {execute => (
      <button
        type='submit'
        className='btn btn-sm btn-primary'
        onClick={() => {
          execute({
            variables: {
              input: {
                name,
                isPrivate: false,
                isEditable: false
              }
            }
          })
          dismiss()
        }}
      >
        Create Room
      </button>
    )}
  </Mutation>
)

class JoinRoomModal extends Component {
  constructor (props) {
    super(props)
    this.state = { filterVal: '' }
  }

  render () {
    return (
      <div className='modal-content modal-chat-lg'>
        <div className='modal-header'>
          <h5 className='modal-title font-weight-bold'>Pick a room to join</h5>
          {this.props.closeButton}
        </div>
        <div className='modal-body'>
          <input
            type='text'
            placeholder='Search'
            onChange={event =>
              this.setState({ filterVal: event.target.value.toLowerCase() })
            }
          />
          <p />
          <Query query={CHAT}>
            {loadComponent(chatData => (
              <Query query={ROOMS}>
                {loadComponent(({ rooms }) => {
                  const roomMap = (chatData.chat.rooms || []).reduce(
                    (acc, r) => {
                      acc[r.name.toLowerCase()] = true
                      return acc
                    },
                    {}
                  )
                  const filterVal = this.state.filterVal.toLowerCase()
                  const filteredRooms = rooms.filter(r => {
                    if (roomMap[r.name.toLowerCase()]) return false
                    return (
                      !this.state.filterVal ||
                      r.name.toLowerCase().indexOf(filterVal) !== -1
                    )
                  })
                  if (!roomMap[filterVal] && !filteredRooms.length) {
                    if (filterVal.length < 4 || filterVal.includes(',')) {
                      return (
                        <p>
                          To create a new room, please use a name greater than 5
                          alpha numeric characters.
                        </p>
                      )
                    }
                    return (
                      <CreateRoom
                        name={filterVal}
                        dismiss={this.props.dismiss}
                        history={this.props.history}
                      />
                    )
                  }
                  return (
                    <div className='scroll'>
                      <Mutation
                        update={(_, { data }) => {
                          chatdb.pushRoom(data.joinRoom)
                          this.props.history.push(`/chat/${data.joinRoom.id}`)
                        }}
                        mutation={JOIN_ROOM}
                      >
                        {execute => (
                          <ul className='list-group'>
                            {filteredRooms.map((room, i) => (
                              <li
                                key={i}
                                onClick={() => {
                                  execute({
                                    variables: { input: { id: room.id } }
                                  })
                                  this.props.dismiss()
                                }}
                                className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                              >
                                <span>
                                  <strong className='font-weight-bold'>
                                    {room.name}
                                  </strong>&nbsp;{room.description}
                                </span>
                                <span className='badge badge-primary'>
                                  {room.userCount || ''}
                                </span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </Mutation>
                    </div>
                  )
                })}
              </Query>
            ))}
          </Query>
        </div>
      </div>
    )
  }
}

const MsgUser = ({ history, user, dismiss }) => (
  <Mutation
    mutation={DIRECT_MESSAGE_ROOM}
    variables={{
      input: {
        id: String(user.id),
        username: user.username
      }
    }}
  >
    {execute => (
      <li className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'>
        <span className='font-weight-bold'>{user.username}</span>
        <button
          type='button'
          className='btn btn-sm btn-default'
          onClick={() => {
            execute().then(d => {
              history.push(`/chat/${d.data.directMessageRoom.id}`)
            })
            dismiss()
          }}
        >
          Message User
        </button>
      </li>
    )}
  </Mutation>
)

class DirectMessageModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      userInput: ''
    }
    this.makeChangeHandler = this.makeChangeHandler.bind(this)
  }

  makeChangeHandler (event) {
    this.setState({ userInput: event.target.value.toLowerCase() })
  }

  render () {
    return (
      <Query query={CHAT}>
        {loadComponent(({ chat }) => {
          const usersList = chat.users
            .filter(user => {
              const userInput = this.state.userInput.toLowerCase()
              return (
                user.username.toLowerCase().includes(userInput) &&
                user.id !== window.userInfo.id
              )
            })
            .map((user, i) => (
              <MsgUser
                user={user}
                key={i}
                dismiss={this.props.dismiss}
                history={this.props.history}
              />
            ))

          return (
            <div className='modal-content modal-chat-lg'>
              <div className='modal-header'>
                <h5 className='modal-title font-weight-bold'>
                  Choose user to chat with
                </h5>
                {this.props.closeButton}
              </div>
              <div className='modal-body'>
                <div className='form-group'>
                  <label htmlFor='username'>User to add to chatroom</label>
                  <input
                    type='text'
                    name='username'
                    placeholder='username'
                    onChange={this.makeChangeHandler}
                  />
                  <p />
                  <div className='scroll'>
                    <ul className='list-group'>{usersList}</ul>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>{this.props.cancelButton}</div>
            </div>
          )
        })}
      </Query>
    )
  }
}

const EditRoomNameModal = ({
  roomId,
  roomName = '',
  description = '',
  dismiss,
  closeButton,
  cancelButton
}) => {
  let nameref = {}
  let desref = {}
  return (
    <Mutation mutation={EDIT_ROOM}>
      {execute => (
        <div className='modal-content modal-chat-sm'>
          <div className='modal-header'>
            <h5 className='modal-title font-weight-bold'>Edit {roomName}</h5>
            {closeButton}
          </div>
          <div className='modal-body'>
            <div className='form-group'>
              <label htmlFor='roomName'>Room Name</label>
              <input
                type='text'
                id='roomName'
                name='roomName'
                defaultValue={roomName}
                ref={ref => (nameref = ref)}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='description'>Description</label>
              <input
                type='text'
                id='description'
                name='description'
                defaultValue={description}
                ref={ref => (desref = ref)}
              />
            </div>
          </div>
          <div className='modal-footer'>
            {cancelButton}
            <button
              className='btn btn-primary'
              onClick={() => {
                execute({
                  variables: {
                    input: {
                      id: roomId,
                      name: nameref.value,
                      description: desref.value
                    }
                  }
                })
                dismiss()
              }}
            >
              Edit
            </button>
          </div>
        </div>
      )}
    </Mutation>
  )
}

class AddUserModal extends Component {
  constructor (props) {
    super(props)
    this.state = {
      filteredUsers: this.props.otherUsersForRoom
    }
    this.handleChange = this.handleChange.bind(this)
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.otherUsersForRoom !== this.state.otherUsersForRoom) { this.setState({ filteredUsers: nextProps.otherUsersForRoom }) }
  }

  handleChange (event) {
    const filteredUsers = Object.values(this.props.otherUsersForRoom).reduce(
      (acc, user) => {
        if (
          user.name.toLowerCase().indexOf(event.target.value.toLowerCase()) !==
          -1
        ) {
          acc[user.user_id] = user
        }
        return acc
      },
      {}
    )
    this.setState({
      filteredUsers
    })
  }

  render () {
    const OtherUsersForRoom = this.state.filteredUsers
      ? Object.values(this.state.filteredUsers).map((user, i) => {
        return (
          <li
            key={i}
            className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
          >
            <span className='font-weight-bold'>{user.name}</span>
            <button
              type='button'
              className='btn btn-sm btn-default'
              onClick={() => {
                chatdb.addUserToRoom(this.props.currentRoom, user)
                this.props.toggleAddModal()
              }}
            >
                Add user
            </button>
          </li>
        )
      })
      : null

    return (
      <div className='modal-content modal-chat-lg'>
        <div className='modal-header'>
          <h5 className='modal-title font-weight-bold'>
            Add users to {this.props.roomName}
          </h5>
          {this.props.closeButton}
        </div>
        <div className='modal-body'>
          <div className='form-group'>
            <label htmlFor='username'>User to add to chatroom</label>
            <input
              type='text'
              name='username'
              placeholder='username'
              onChange={this.handleChange}
            />
            <p />
            <div className='scroll'>
              <ul className='list-group'>{OtherUsersForRoom}</ul>
            </div>
          </div>
        </div>
        <div className='modal-footer'>{this.props.cancelButton}</div>
      </div>
    )
  }
}

const LeaveRoomModal = ({
  history,
  roomId,
  roomName,
  dismiss,
  toggleLeaveModal,
  closeButton,
  cancelButton
}) => {
  return (
    <Mutation mutation={LEAVE_ROOM} variables={{ input: { id: roomId } }}>
      {execute => (
        <div className='modal-content modal-chat-sm'>
          <div className='modal-header'>
            <h5 className='modal-title font-weight-bold'>Leave {roomName}</h5>
            {closeButton}
          </div>
          <div className='modal-body'>
            <div className='form-group'>Confirm leave room {roomName}?</div>
          </div>
          <div className='modal-footer'>
            {cancelButton}
            <button
              className='btn btn-primary'
              onClick={() => {
                dismiss()
                execute()
                history.push(`/chat/1`)
              }}
            >
              Leave Room
            </button>
          </div>
        </div>
      )}
    </Mutation>
  )
}

const DeleteRoomModal = ({
  history,
  match,
  dismiss,
  closeButton,
  cancelButton
}) => {
  const roomId = match.params.id
  return (
    <Query query={CHAT}>
      {loadComponent(chatData => {
        const room = (chatData.chat.rooms || []).reduce((acc, r) => {
          if (+r.id === +roomId) return r
          return acc
        }, 0)
        return (
          <Mutation
            mutation={DESTROY_ROOM}
            variables={{ input: { id: roomId } }}
          >
            {execute => (
              <div className='modal-content modal-chat-sm'>
                <div className='modal-header'>
                  <h5 className='modal-title font-weight-bold'>
                    Delete {room.name} ?
                  </h5>
                  {closeButton}
                </div>
                <div className='modal-body'>
                  <div className='form-group'>
                    Are you sure you want to delete room {room.name}? All data
                    will be permanently deleted, so make sure you check with
                    everyone in the room first.
                  </div>
                </div>
                <div className='modal-footer'>
                  {cancelButton}
                  <button
                    className='btn btn-primary'
                    onClick={() => {
                      execute()
                      dismiss()
                      history.push(`/chat/1`) // Go back to original room
                    }}
                  >
                    Delete Room
                  </button>
                </div>
              </div>
            )}
          </Mutation>
        )
      })}
    </Query>
  )
}

const DeleteMessageModal = ({ toggleModal, confirmDelete }) => {
  return (
    <div className='modal-content modal-chat-sm'>
      <div className='modal-header'>
        <h5 className='modal-title'>Confirm delete message</h5>
        <button
          type='button'
          className='close'
          aria-label='Close'
          onClick={toggleModal}
        >
          <span aria-hidden='true'>&times;</span>
        </button>
      </div>
      <div className='modal-body'>
        Are you sure you want to delete the message?
      </div>
      <div className='modal-footer'>
        <button
          type='button'
          className='btn btn-primary'
          data-dismiss='modal'
          onClick={toggleModal}
        >
          Cancel
        </button>
        <button
          type='button'
          className='btn btn-danger'
          onClick={confirmDelete}
        >
          Delete
        </button>
      </div>
    </div>
  )
}

export { NoConnectionModal, ChatModal, DeleteMessageModal }
