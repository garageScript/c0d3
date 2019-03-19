import React from 'react'

const ForgotPassword = () => {
  return <div className='container'>
    <form className='auth-form'>
      <p className='h5 mb-4'> Forgot Password?</p>
      <p>Please enter your email address below to recieve the reset password link.</p>
      Email: <input />
      <button className='btn btn-primary'>Submit</button>
    </form>
  </div>
}

export default ForgotPassword
