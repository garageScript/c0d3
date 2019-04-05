import React from 'react'
import { Query } from 'react-apollo'
import { GET_USERNAME } from '../../db/queries.js'
import { loadComponent } from './shared.js'

// import User from '../../db/db'

/* class User extends Component {
  constructor (props) {
    super(props)
    this.state = {
      name: this.props.userId ? '...' : ''
    }
    if (this.props.userId) {

      db.getNames(this.props.userId, name => {
        this.setState({ name })
      })

    }
  }

  render () {
    return (
      <span className={this.props.className || ''}>
        {this.state.name || ''}
      </span>
    )
  }
} */

const User = ({ userId, className }) => {
  return (
    <Query query={GET_USERNAME} variables={{ input: userId }} >
      {(data) => {
        console.log('data', data)
        return <h1>{data.getUsername.username} </h1>
      }}
    </Query>
  )
}

export default User
