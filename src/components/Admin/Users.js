import React from 'react'
import { compose } from 'react-apollo'
import { loadComponent } from '../shared/shared.js'
import { getUsersAdminContainer, setAdminContainer} from '../../db/queries.js'

const UsersAdmin = ( { users, mutate } ) => {
  const toggleAdmin = u => () => mutate( {
    variables: { in: { userId: u.id, isAdmin: !u.isAdmin } }
  })

  const rows = users.map(u => {
    const buttonClass = (u.isAdmin) ? 'btn-primary' : 'btn-outline-primary waves-effect'
    return (
      <tr key={u.id}>
        <th>{u.id}</th>
        <th>{u.name}</th>
        <th>{u.username}</th>
        <th>{u.email}</th>
        <th>
          <button
            type='button'
            className={`btn btn-sm ${buttonClass}`}
            onClick={toggleAdmin(u)}
          >
            Admin
          </button>
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

export default compose(
  getUsersAdminContainer,
  setAdminContainer
)(loadComponent(UsersAdmin))
