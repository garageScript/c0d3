import React, { Component } from 'react'
import moment from 'moment'
import Markdown from 'react-markdown'
import { Query } from 'react-apollo'

import { DeleteMessageModal } from './ChatModals.js'
import LinkRenderer from '../helpers/windowLink'
import { ROOM_INFO } from './queries'
import { loadComponent } from '../shared/shared'

const SCROLL_FETCH_BUFFER = 100

class Edit extends Component {
  constructor (props) {
    super(props)
    this.state = { content: this.props.message.content }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange (e) {
    this.setState({ content: e.target.value })
  }

  handleSubmit (e) {
    e.preventDefault()
    if (this.props.authenticatedUser !== this.props.userName) return
    if (this.state.content === this.props.message.content) return
    this.props.editMessage(
      this.props.room,
      this.props.messageId,
      this.state.content
    )
    this.props.toggleEdit()
  }

  render () {
    return (
      <form id='edit-form' onSubmit={this.handleSubmit}>
        <label htmlFor='message' hidden />
        <textarea
          type='text'
          name='content'
          value={this.state.content}
          onChange={this.handleChange}
        />
        <button type='submit' className='btn btn-primary btn-sm'>
          Edit
        </button>
        <button
          type='button'
          onClick={this.props.toggleEdit}
          className='btn btn-primary btn-sm'
        >
          Cancel
        </button>
        <button
          type='button'
          onClick={this.props.toggleModal}
          className='btn btn-primary btn-sm'
        >
          Delete
        </button>
      </form>
    )
  }
}

export class Message extends Component {
  constructor (props) {
    super(props)
    this.state = { editing: false, showModal: false }
    this.toggleEdit = this.toggleEdit.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.confirmDelete = this.confirmDelete.bind(this)
  }

  toggleEdit () {
    this.setState({ editing: !this.state.editing })
  }

  toggleModal () {
    this.setState({ showModal: !this.state.showModal })
  }

  confirmDelete () {
    this.props.deleteMessage(this.props.message.room_id, this.props.message.id)
    this.setState({
      editing: !this.state.editing,
      showModal: !this.state.showModal
    })
  }

  render () {
    const modal = this.state.showModal ? (
      <DeleteMessageModal
        toggleModal={this.toggleModal}
        confirmDelete={this.confirmDelete}
      />
    ) : null

    const messageContent = (
      <div
        onClick={this.toggleEdit}
        className='card-text'
        style={{ marginTop: '5px' }}
      >
        <Markdown
          escapeHtml
          source={this.props.message.content}
          renderers={{ Link: LinkRenderer }}
          className='chat-markdown'
        />
      </div>
    )

    const editing =
      this.state.editing &&
      this.props.userName === this.props.authenticatedUser ? (
        <div>
            <Edit
            message={this.props.message}
            editMessage={this.props.editMessage}
            toggleEdit={this.toggleEdit}
            room={this.props.message.room_id}
            messageId={this.props.message.id}
            cancel={this.toggleEdit}
            toggleModal={this.toggleModal}
            userName={this.props.userName}
            authenticatedUser={this.props.authenticatedUser}
            />
          </div>
        ) : null

    return (
      <div>
        {modal}
        {messageContent} {editing}
      </div>
    )
  }
}

class MessageContainer extends Component {
  constructor (props) {
    super(props)
    this.state = { scrollTop: -1, scrollHeight: 0 }
    this.handleScroll = this.handleScroll.bind(this)
  }

  componentDidUpdate (prevProps) {
    // Scroll to the bottom IF page first loaded OR distance scrolled is within threshold and no messages were added, i.e. an edit has occcured so don't scroll
    this.refs.chatBody.scrollTop = this.refs.chatBody.scrollHeight
  }

  scrollToBottom () {
    const scrollHeight = this.refs.chatBody.scrollHeight
    const height = this.refs.chatBody.clientHeight
    const maxScrollTop = scrollHeight - height
    this.refs.chatBody.scrollTop = Math.max(maxScrollTop, 0)
  }

  handleScroll () {
    if (this.refs.chatBody.scrollTop <= SCROLL_FETCH_BUFFER) {
      // TODO: get more messages
      this.setState({ scrollHeight: this.refs.chatBody.scrollHeight })
    }
    this.setState({ scrollTop: this.refs.chatBody.scrollTop })
  }

  render () {
    const { roomInfo } = this.props
    const users = roomInfo.users.reduce((acc, user) => {
      acc[user.id] = user
      return acc
    }, {})
    return (
      <div
        className='chat-body scrollbar-chat'
        ref='chatBody'
        onScroll={this.handleScroll}
      >
        {roomInfo.messages.map((message, i) => {
          const user = users[message.userId] || {}
          const status = user.online
            ? 'is-active green-border'
            : 'is-active red-border'
          const edited = message.isEdited ? (
            <span className='chat-message-time'>
              (edited {moment(new Date(message.updatedAt)).calendar()})
            </span>
          ) : null
          return (
            <div className='chat-message card' key={i}>
              <div className='card-body'>
                <div className={status} />{' '}
                <span className='chat-message-name'>
                  {user.username || 'Anonymous'}
                </span>
                <span className='chat-message-time'>
                  {' '}
                  {moment(new Date(message.createdAt)).calendar()} {edited}
                </span>
                <Message
                  message={message}
                  editMessage={() => {}}
                  deleteMessage={() => {}}
                  userName={user.name}
                  authenticatedUser={'test'}
                />
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}

const ChatBody = ({ roomId }) => (
  <Query
    query={ROOM_INFO}
    variables={{ input: { id: roomId } }}
    fetchPolicy='network-only'
  >
    {loadComponent(({ roomInfo }) => {
      const users = (roomInfo.users || []).reduce((acc, u) => {
        acc[u.id] = u
        return acc
      }, {})
      return <MessageContainer roomInfo={roomInfo} users={users} />
    })}
  </Query>
)

export default ChatBody
