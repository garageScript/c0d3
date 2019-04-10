import React from 'react'
import { Query } from 'react-apollo'
import { GET_USERNAME } from '../../db/queries.js'
import { loadComponent } from './shared.js'

const User = ({ userId }) => {
  return (
    <Query query={GET_USERNAME} variables={{ input: userId }} >
      {loadComponent(({ getUsername }) => {
        if (getUsername) return <span> {getUsername.username || 'Anonymous'} </span>
        return <span> Non-Existing-User </span>
      })}
    </Query>
  )
}

export default User
