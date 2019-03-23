import React from 'react'
import BaseValidationForm from '../helpers/auth/BaseValidationForm'
import { debounce } from '../helpers/helpers'
import { withRouter } from 'react-router'
import { RESET_PASSWORD } from '../../db/queries'
import { Mutation } from 'react-apollo'

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
    return (
      <div className='container'>
        <p className='h5 mb-4'>New Password</p>
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
        <Mutation mutation={RESET_PASSWORD}>
          {(execute) => {
            return (
              <button className='btn btn-primary' type='submit' onClick={() => {
                execute({
                  variables: {
                    input: this.state.passwordConfirm
                  }
                })
              }}>
            Submit New Password
              </button>
            )
          }}
        </Mutation>
      </div>
    )
  }
}
const NewPassword = withRouter(ResetPassword)

export default ResetPassword
