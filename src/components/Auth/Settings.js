import React from 'react'
import PassWordChange from './PasswordChange'

export const Settings = () => {
  const url = window.location.href.split('=')[1]
  const [resetText, resetTextClass] = [url === 'true' ? 'Your password needs to be at least 8 characters for Mattermost and Gitlab: Please reset your password' : '', url === 'true' ? 'alert alert-danger' : ''
  ]
  return (
    <div>
      <div style={{ textAlign: 'center' }} >
        <h1>Settings Page</h1>
        <h5 style={{ margin: '0px 300px' }} className={resetTextClass}>{resetText}</h5>
      </div>
      <PassWordChange />
    </div>
  )
}
