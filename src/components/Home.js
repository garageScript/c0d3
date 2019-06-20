import React from 'react'
import { Query } from 'react-apollo'
import Markdown from 'react-markdown'

import { GET_ANNOUNCEMENTS } from '../db/queries.js'
import { loadComponent } from './shared/shared.js'

const Home = () => {
  const reset = window.userInfo.mustReset
  if (reset) {
    window.location.assign(`${window.location}settings?reset=${reset}`)
  }
  return (
    <div>
      <div className='gs-container-2'>
        <div className='gs-body-space'>
          <h3 className='gs-h3'>General Announcements</h3>
          <h5 className='gs-h5'>
            Updates and Guidelines
            <div className='mt-1'>
              <small>
                To make space for other students on our servers, your account
                will be deleted after 30 days of inactivity.
              </small>
            </div>
            <div className='mt-1'>
              <small>
                Take each lesson challenge seriously and do them over and over
                again until you can solve them. With the exception of End to
                End, all challenges are questions and exercises taken from real
                interviews.
              </small>
            </div>
            <div className='mt-1'>
              <small>
                These lessons will not only prepare you for your interviews, but
                it will also help you teach you the skills that you need to
                become an effective engineer.
              </small>
            </div>
            <div className='mt-1'>
              <small>
                After completing Foundations of JavaScript, Variables &
                Functions, Arrays, Objects, End To End, HTML/CSS/JavaScript,
                React/GraphQL/SocketIO, you will be technically ready to
                contribute to our codebase.
              </small>
            </div>
          </h5>
          <Query className='announcements' query={GET_ANNOUNCEMENTS}>
            { loadComponent(({ announcements }) => {
              return announcements.map((v, i) => {
                return <Markdown key={i} source={v.description} />
              })
            })}
          </Query>
        </div>
      </div>
    </div>
  )
}

export default Home