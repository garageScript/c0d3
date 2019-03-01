import React from 'react'
const generalUpdates = []
const announcements = []
let update = ''
let newAnnouncement = ''
const Admin = () => (
  <div className='admin'>
    <h1>Admin Page</h1>
    <textarea className='update'onChange={(v) => {
      update = v.target.value
      generalUpdates.push(update)
    }} />
    <button className='updateButton' onClick={() => {
      /*
      fetch('/graphql', {
        method: 'POST'.
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          update,
          generalUpdates,
        })
      })
      */
    }}>UPDATE</button>
    <h1>New Announcements</h1>
    <textarea className='newAnnouncements' onChange={(input) => {
      newAnnouncement = input.target.value
      announcements.push(newAnnouncement)
    }} />
    <button className='submitAnnouncement' onClick={() => {
      /* fetch('/graphql', {
        method: 'POST'.
        headers: {
          'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
          newAnnouncement,
          announcements
        })
      })
      */
    }}>SUBMIT</button>
    <h1>Previous Announcements</h1>
    <div className='previousAnnouncements' />
  </div>
)

export default Admin
