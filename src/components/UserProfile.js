import React from 'react'
import { Query } from 'react-apollo'
import DatePicker from 'react-datepicker'
import moment from 'moment'

import 'react-datepicker/dist/react-datepicker.css'
import '../css/UserProfile.css'
import { LESSONS, USERS, RECEIVED_STARS, USER_DATA } from '../db/queries'
import PwChangeForm from './PasswordChange'
import { loadComponent } from './shared/shared'
import gitLabMR from '../helpers/gitlabMrs'

const getMrs = (name, created_before, created_after) => {
  return new Promise((resolve, reject) => {
    gitLabMR.retrieveMR(name, created_before, created_after, mrVal => {
      resolve(mrVal)
    })
  })
}

class MrComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      toggle: false
    }
    this.toggle = this.toggle.bind(this)
  }

  toggle () {
    this.setState({
      toggle: !this.state.toggle
    })
  }

  render () {
    return (
      <div>
        <span className='upvote-icon'>
          <i className='fa fa-thumbs-up ml-2' aria-hidden='true' />
        </span>
        <span className='upvote-data'>{this.props.mrequests.upvotes}</span>
        <button
          onClick={this.toggle}
          className='btn red lighten-1 gs-button text-capitalize'
        >
            Description
        </button>
        {this.state.toggle ? (
          <div>{this.props.mrequests.description}</div>
        ) : null}
      </div>
    )
  }
}

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
