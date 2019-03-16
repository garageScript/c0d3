import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation } from 'react-apollo'
import { loadComponent } from '../shared/shared.js'
import { USERS } from '../../db/queries.js'

const UsersAdmin = () => {
  return (
    <Query query={USERS}>
      { loadComponent(({ users }) => {
        const rows = users.map(u => {
          return (
            <tr key={u.id}>
              <th>{u.id}</th>
              <th>{u.name}</th>
              <th>{u.username}</th>
              <th>{u.email}</th>
            </tr>
          )
        })
        return (
          <div className='container'>
            <div className='table-responsive'>
              <table className='table table-striped'>
                <thead>
                  <tr>
                    <th className='th-sm'>ID</th>
                    <th className='th-sm'>Name</th>
                    <th className='th-sm'>Username</th>
                    <th className='th-sm'>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>
            </div>
          </div>
        )
      })}
    </Query>
  )
}
export default UsersAdmin
