/* global alert */
import React from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import BaseValidationForm from '../../helpers/auth/BaseValidationForm'
import { debounce } from '../../helpers/helpers'
import { FORGOT_RESET_PASSWORD } from '../../db/queries'

const Successful = () => {
  return (
    <div className='container'>
      <div className='auth-form'>
        <p className='h5 mb-4'>Success!</p>
        <p>
Please go to the sign in page and log in with your new credentials
        </p>
        <Link to='/signin'>
          Sign In ->
        </Link>
      </div>
    </div>
  )
}

class ResetPassword extends BaseValidationForm {
  constructor (props) {
    super(props)
    this.state = {
      password: { ...this.fieldProps },
      passwordConfirm: { ...this.fieldProps }
    }
    this.validateInput = debounce(() => {
      return this.validateInputs({
        password: this.state.password.value,
        passwordConfirm: this.state.passwordConfirm.value
      })
    }, 800)
  }
  render () {
    if (this.state.complete) return <Successful />
    return (
      <div className='container'>
        <div className='auth-form'>
          <p className='h5 mb-4'>Reset Password</p>
          <div className='md-form'>
            <label htmlFor='new-password'>New Password</label>
            <input
              id='pw-change-new-password'
              className='form-control'
              name='password'
              type='password'
              autoComplete='off'
              onChange={this.recordInput}
            />
            <div className={this.state.password.feedbackClass}>
              {this.state.password.feedback}
            </div>
          </div>
          <div className='md-form'>
            <label htmlFor='confirm-new-password'>Confirm Password</label>
            <input
              id='confirm-new-password'
              className={this.state.passwordConfirm.inputClass}
              name='passwordConfirm'
              type='password'
              autoComplete='off'
              onChange={this.recordInput}
            />
            <div className={this.state.passwordConfirm.feedbackClass}>
              {this.state.passwordConfirm.feedback}
            </div>
          </div>
          <Mutation mutation={FORGOT_RESET_PASSWORD} onCompleted={() => {
          }}>
            {(execute) => {
              return (
                <button className='btn btn-primary' type='submit' onClick={() => {
                  execute({
                    variables: {
                      input: {
                        password: this.state.password.value,
                        forgotToken: this.props.match.params.token
                      }
                    }
                  }).then(() => { this.setState({ complete: true }) })
                }} >
            Submit New Password
                </button>
              )
            }}
          </Mutation>

        </div>
      </div>
    )
  }
}
const NewPassword = withRouter(ResetPassword)

export default NewPassword
