import React from 'react'
const Admin = () => (
  <div className='admin'>
    <h1>Admin Page</h1>
    <textarea className='update'onChange={(v) => {
    }} />
    <button className='updateButton' onClick={() => {
    }}>UPDATE</button>
    <h1>New Announcements</h1>
    <textarea className='newAnnouncements' />
    <button className='submitAnnouncement'>SUBMIT</button>
    <h1>Previous Announcements</h1>
    <div className='previousAnnouncements' />
  </div>
)
