import React from 'react'

const CheckEmail = () => {
  return (
    <div style={{
      width: '600px',
      marginTop: '150px'
    }}className='container' >
      <div style={{ padding: '20px' }} className='card'>
        <h4>Please check your email for new password link. If you haven't received it yet, please request for new password link below.</h4>
        <button className='btn btn-info'>Request New Password</button>
      </div>
    </div>
  )
}

export default CheckEmail
