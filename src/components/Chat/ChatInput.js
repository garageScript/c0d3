import React from 'react'
import { Mutation } from 'react-apollo'
import { CREATE_MESSAGE } from './queries'
import chatdb from '../../db/chatdb'

const parseMessage = msg => {
  return msg
    .split(' ')
    .map(m => {
      // parsing logic for http urls to change into markdown link [linkText](url)
      if (m.indexOf('http') === 0) {
        const parts = m.split('.')
        const first = parts[0].split('/')
        const domain = `${first[first.length - 1]}.${parts[1]}.${parts[2] ||
          ''}`
        const linkText = domain.split('/')[0]
        return `[${linkText}](${m})`
      }
      return m
    })
    .join(' ')
}

class ChatInput extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      message: ''
    }
    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (event) {
    this.setState({
      message: event.target.value
    })
  }

  render () {
    const runFunc = execute => {
      if (!this.state.message || !this.state.message.length) return
      const content = parseMessage(this.state.message)
      const tmpId = `tmp-${Date.now()}`
      execute({
        variables: {
          input: {
            roomId: this.props.roomId,
            content,
            tmpId
          }
        }
      })
      chatdb.pushMessage(this.props.roomId, {
        content,
        id: tmpId
      })
      this.setState({
        message: ''
      })
    }
    return (
      <Mutation mutation={CREATE_MESSAGE}>
        {execute => (
          <div className='chat-input form-group shadow-textarea'>
            <textarea
              type='text'
              placeholder='Send a message'
              value={this.state.message}
              rows='5'
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  runFunc(execute)
                  e.preventDefault()
                }
              }}
              onChange={this.handleInputChange}
              style={{ width: '100%' }}
              ref='inputNewMessage'
              className='form-control z-depth-1'
            />
            <button
              type='submit'
              onClick={() => runFunc(execute)}
              className='btn btn-sm btn-default'
            >
              Send
            </button>
          </div>
        )}
      </Mutation>
    )
  }
}

export default ChatInput
