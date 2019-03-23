import React from 'react'

const CheckEmail = () => {
  return (
    <div style={{
      width: '600px',
      marginTop: '150px'
    }}className='container' >
      <div style={{ padding: '20px' }} className='card'>
        <h4>Please check your email for new password link. If you have not received it yet, please try again.</h4>
        <button className='btn btn-info' onClick={() => {
          window.location = '/forgotpassword'
        }} > Try Again </button>
      </div>
    </div>
  )
}

export default CheckEmail
