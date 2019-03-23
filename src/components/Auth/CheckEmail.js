import React from 'react'
import { Link } from 'react-router-dom'

const CheckEmail = () => {
  return (
    <div style={{
      width: '600px',
      marginTop: '150px',
      padding: '30px'
    }} className='container' >
      <div style={{ padding: '50px' }} className='card'>
        <h4>Please check your email for new password link. If you have not received it yet, please try again.</h4>
        <Link to='/forgotpassword'>
          <button className='btn btn-info btn-block' style={{ marginTop: '20px' }}>Try Again </button>
        </Link>
      </div>
    </div>
  )
}

export default CheckEmail
