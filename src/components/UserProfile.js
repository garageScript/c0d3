import React from 'react'
import { Query } from 'react-apollo'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import '../css/UserProfile.css'
import { USER_DATA } from '../db/queries'
import { loadComponent } from './shared/shared'

const UserProfile = ({ match }) => {
  return (
    <Query query={USER_DATA} variables={{ in: { username: match.params.userId } }}>
      {loadComponent(({ userInfo: {
        name,
        createdAt
      } }) => {
        const firstName = name.split()[0]
        return (
          <div className='container'>
            <h1>PROFILE</h1>
            <hr />
            <div>
              <h3>{ name }</h3>
              <p>{firstName} joined C0D3.com on { moment(parseInt(createdAt)).calendar() }, { moment(parseInt(createdAt)).fromNow() } </p>
            </div>
            <hr />
            <h3>Stars Ratings</h3>
            <hr />
            <h3>SUBMISSIONS</h3>
            <hr />
            <h3>Student Stats</h3>
          </div>
        )
      }) }
    </Query>
  )
}

export default UserProfile
