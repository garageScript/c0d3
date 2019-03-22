import React from 'react'
import { Mutation } from 'react-apollo'
import { SEND_EMAIL } from '../db/queries'

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
      <Mutation mutation={SEND_EMAIL}>
        {(execute) => {
          return (
            <button onClick={() => {
              execute({
                variables: {
                  input: emailRef.current.value
                }
              })
              window.location = '/checkemail'
            }}>Submit</button>)
        }}
      </Mutation>
    </div>
  )
}

export default ForgotPassword
