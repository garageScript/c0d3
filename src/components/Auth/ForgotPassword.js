import React from 'react'
import { Mutation } from 'react-apollo'
import { SEND_FORGOT_EMAIL } from '../../db/queries'
import { withRouter } from 'react-router'

const ForgotPasswordComponent = ({ history }) => {
  let emailRef = React.createRef()
  return (
    <div className='container'>
      <div className='auth-form'>
        <p className='h5 mb-4'> Forgot Password?</p>
        <p>Please enter your email address below to receive instructions for resetting your password</p>
        <label htmlFor='forgotPasswordEmail'>
            Email:
          <input
            id='forgotPasswordEmail'
            className='form-control'
            type='email'
            placeholder='hello@c0d3.com'
            ref={emailRef}
          />
        </label>
        <Mutation mutation={SEND_FORGOT_EMAIL} >
          {(execute) => {
            return (
              <button className='btn btn-primary'
                onClick={() => {
                  execute({
                    variables: {
                      input: emailRef.current.value
                    }
                  }).then(() => {
                    history.push('/checkemail')
                  })
                }}>Submit</button>
            )
          }}
        </Mutation>

      </div>
    </div>
  )
}

const ForgotPassword = withRouter(ForgotPasswordComponent)
export default ForgotPassword
