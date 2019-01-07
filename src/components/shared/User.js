import React, { Component } from 'react'
// import db from '../../db/db'

class User extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: this.props.userId ? '...' : ''
    }
    if (this.props.userId) {
      /*
      db.getNames(this.props.userId, name => {
        this.setState({ name })
      })
      */
    }
  }

  render () {
    return (
      <span className={this.props.className || ''}>
        {this.state.name || ''}
      </span>
    )
  }
}
export default User
