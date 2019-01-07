import React, { Component } from 'react'
import moment from 'moment'
import Markdown from 'react-markdown'

import chatdb from '../../db/chatdb'
import LinkRenderer from '../helpers/windowLink'

const RESULTS_PER_PAGE = 10

class ChatSearch extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchTerm: '',
      page: 1
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.handlePrevious = this.handlePrevious.bind(this)
    this.handleNext = this.handleNext.bind(this)
  }

  handleInputChange (event) {
    this.setState({
      searchTerm: event.target.value
    })
  }

  handleSubmit (event) {
    event.preventDefault()
    event.stopPropagation()
    if (
      !this.props.authenticatedUser ||
      !this.props.userInfo.id ||
      !/\S/.test(this.state.searchTerm)
    ) { return }
    chatdb.search(this.props.userInfo.id, this.state.searchTerm)
    this.setState({
      page: 1
    })
  }

  handleClear (event) {
    this.setState({
      searchTerm: '',
      page: 1
    })
    this.props.searchClear()
  }

  handlePrevious (event) {
    if (this.state.page <= 1) return
    this.setState({
      page: this.state.page - 1
    })
  }

  handleNext (event) {
    if (this.state.page * RESULTS_PER_PAGE >= this.props.search.gsLength()) { return }
    this.setState({
      page: this.state.page + 1
    })
  }

  render () {
    const searchLength = this.props.search.gsLength()
    const searchResults = Object.values(this.props.search)
      .reverse()
      .map((message, i) => {
        const user = this.props.users[message.user_id] || {}
        const status = user.is_active
          ? 'is-active green-border'
          : 'is-active red-border'
        const edited = message.edited_time ? (
          <span className='chat-message-time'>
            (edited {moment(message.edited_time).calendar()})
          </span>
        ) : null
        const hideMessage =
          i >= this.state.page * RESULTS_PER_PAGE ||
          i < RESULTS_PER_PAGE * (this.state.page - 1)
            ? 'hideChatComponent'
            : null

        const nameSplit = message.room_name.split(',')
        let roomName
        if (nameSplit.length === 1) roomName = nameSplit[0]
        else if (nameSplit[0] === this.props.userInfo.name) { roomName = nameSplit[1] } else roomName = nameSplit[0]

        return (
          <div className={`chat-message ${hideMessage}`} key={i}>
            <div>
              <div className='chat-result-room'>@{roomName}</div>
              <div className={status} />{' '}
              <span className='chat-message-name'>
                {user.name || 'Anonymous'}
              </span>
              <span className='chat-message-time'>
                {' '}
                {moment(message.created_at).calendar()} {edited}
              </span>
              <Markdown
                escapeHtml
                source={message.content}
                renderers={{ Link: LinkRenderer }}
                className='chat-markdown'
              />
            </div>
          </div>
        )
      })

    const NoResultsDisplay = () => {
      return <div className='chat-no-results'>No Results Found</div>
    }

    const chatSearchHeader =
      searchLength || this.props.noSearchResults ? (
        <div className='chat-search-header'>
          <span className='font-weight-bold'>
            {searchLength} Search Results
          </span>
          <button
            type='button'
            className='close mr-3'
            aria-label='Close'
            onClick={this.handleClear}
          >
            <span aria-hidden='true'>&times;</span>
          </button>
          <nav className='chat-search-nav'>
            <ul className='pagination'>
              <li className='page-item' onClick={this.handlePrevious}>
                <a className='page-link' aria-label='Previous'>
                  <span aria-hidden='true'>«</span>
                  <span className='sr-only'>Previous</span>
                </a>
              </li>
              <li className='page-item'>
                <a className='page-link'>{this.state.page}</a>
              </li>
              <li className='page-item' onClick={this.handleNext}>
                <a className='page-link' aria-label='Next'>
                  <span aria-hidden='true'>»</span>
                  <span className='sr-only'>Next</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      ) : null

    const hideChatSearch =
      !searchLength || this.props.noSearchResults ? 'hideChatComponent' : null

    const hideNoSearchResults =
      !searchLength && !this.props.noSearchResults ? 'hideChatComponent' : null

    return (
      <div className='chat-search'>
        <form className='md-form input-group' onSubmit={this.handleSubmit}>
          <input
            type='text'
            placeholder='Search'
            value={this.state.searchTerm}
            className='form-control'
            onChange={this.handleInputChange}
          />
          <span className='input-group-btn'>
            <button
              type='submit'
              className='search-button my-0 btn btn-sm btn-default'
            >
              <i className='fa fa-search' aria-hidden='true' />
            </button>
          </span>
        </form>
        {chatSearchHeader}
        <div className={`chat-search-results scrollbar-chat ${hideChatSearch}`}>
          {searchResults}
        </div>
        <div className={hideNoSearchResults}>
          <NoResultsDisplay />
        </div>
      </div>
    )
  }
}

export default ChatSearch
