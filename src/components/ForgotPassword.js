import React from 'react'

const ForgotPassword = () => {
  let emailRef = React.createRef()
  return (
    <div className='container'>
      <p className='h5 mb-4'> Forgot Password?</p>
      <p>Please enter your email address below to receive instructions for resetting your password</p>
      <label htmlFor='forgotPasswordEmail'>
      Email: <input
        id='forgotPasswordEmail'
        placeholder='hello@c0d3.com'
        ref={emailRef}
        />
      </label>
      <button onClick={() => {
        window.location = '/checkemail'
      }}>Submit</button>
    </div>
  )
}

export default ForgotPassword
