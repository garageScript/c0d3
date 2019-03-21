import React from 'react'

class ResetPassword extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      newPassword: []
    }
  }
  render () {
    return (
      <div className='container'>
        <form className='auth-form'>
          <p className='h5 mb-4'>New Password</p>
          <div
            id='form-message'
            name='formMessage'
          />
          <div className='md-form'>
            <label htmlFor='new-password'>New Password</label>
            <input
              id='newPassword'
              className='form-control'
              name='newPassword'
              type='text'
            />
          </div>
          <div className='md-form'>
            <label htmlFor='confirm-new-password'>Confirm Password</label>
            <input
              id='signin-password'
              className='form-control'
              name='password'
              type='password'
              autoComplete='current-password'
            />
          </div>
          <button className='btn btn-primary' type='submit'>
            Submit New Password
          </button>
        </form>
      </div>
    )
  }
}

export default ResetPassword
