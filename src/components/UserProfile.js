import React from 'react'
import { Query } from 'react-apollo'
import moment from 'moment'
import 'react-datepicker/dist/react-datepicker.css'
import '../css/UserProfile.css'
import { USER_DATA, LESSONS } from '../db/queries'
import { loadComponent } from './shared/shared'
import User from './shared/User.js'

const UserProfile = ({ match }) => {
  return (
    <Query query={USER_DATA} variables={{ in: { username: match.params.userId } }}>
      {loadComponent(({ userInfo: {
        name,
        createdAt,
        stars,
        lessons
      } }) => {
        const passedLessons = lessons.map((l, i) => {
          return (
            <div className='card testimonial-card' key={i} style={{
              display: 'inline-block',
              margin: '20px',
              width: '300px' }} >
              {l.title}
            </div>
          )
        })
        const firstName = name.split()[0]
        const userStars = stars.map((s, i) => {
          const comment = s.comment || 'Thank you for helping me! :)'
          return (
            <div className='card testimonial-card' key={i} style={{ display: 'inline-block', margin: '20px', width: '300px' }}>
              <div className='card-body'>
                <h4 className='card-title'> <User userId={s.studentId} /> </h4>
                <hr />

                <Query query={LESSONS}>
                  {loadComponent(({ lessons }) => {
                    const lesson = lessons.find(e => e.id === s.lessonId)
                    return <h5 className='card-title'>{ lesson.title }</h5>
                  })}
                </Query>
                <i className='fa fa-quote-left' />
                <span style={{ marginLeft: '10px', marginRight: '10px' }}>
                  {comment}
                </span>
                <i className='fa fa-quote-right' />

              </div>
            </div>
          )
        })

        return (
          <div className='container'>
            <h1>PROFILE</h1>
            <hr />
            <div>
              <h3>{ name }</h3>
              <p>{firstName} joined C0D3.com on { moment(parseInt(createdAt)).calendar() }, { moment(parseInt(createdAt)).fromNow() } </p>
            </div>
            <hr />
            <div style={{ textAlign: 'center' }}>{userStars}</div>
            <hr />
            <h3> Curriculum Progress</h3>
            {passedLessons}
            <hr />
            <h3>Student Stats</h3>
          </div>
        )
      }) }
    </Query>
  )
}

export default UserProfile
