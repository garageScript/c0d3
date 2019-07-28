import React from 'react'
import { Mutation } from 'react-apollo'
import { loadComponent } from '../shared/shared.js'
import { getUsersAdminContainer, SET_ADMIN } from '../../db/queries.js'

const UsersAdmin = ( { users } ) => {
  const rows = users.map(u => {
    const buttonClass = (u.isAdmin) ? 'btn-primary' : 'btn-outline-primary waves-effect'
    return (
      <tr key={u.id}>
        <th>{u.id}</th>
        <th>{u.name}</th>
        <th>{u.username}</th>
        <th>{u.email}</th>
        <th>
          <Mutation
            mutation={SET_ADMIN}
            variables={{ in: { userId: u.id, isAdmin: !u.isAdmin } }}
          >
            {(execute) => {
              return (
                <button
                  type='button'
                  className={`btn btn-sm ${buttonClass}`}
                  onClick={execute}
                >
                  Admin
                </button>
              )
            }}
          </Mutation>
        </th>
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
              <th className='th-sm'>Admin</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    </div>
  )
}
export default getUsersAdminContainer(loadComponent(UsersAdmin))
