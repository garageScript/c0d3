import React from 'react'
import { Query } from 'react-apollo'
import { GET_USERNAME } from '../../db/queries.js'
import { loadComponent } from './shared.js'

const User = ({ userId, className }) => {
  return (
    <Query query={GET_USERNAME} variables={{ input: userId }} >
      {loadComponent(({ getUsername }) => {
        return <span className={className || ''}> {getUsername.username || 'Anonymous'} </span>
      })}
    </Query>
  )
}

export default User
