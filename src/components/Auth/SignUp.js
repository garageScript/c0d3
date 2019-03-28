import React from 'react'
import authClient from '../../helpers/auth/client'
import BaseValidationForm from '../../helpers/auth/BaseValidationForm'
import { debounce } from '../../helpers/helpers'
import '../../css/AuthForm.css'

class SignUpForm extends BaseValidationForm {
  constructor (props) {
    super(props)
    this.state = {
      name: { ...this.fieldProps },
      userName: { ...this.fieldProps },
      confirmEmail: { ...this.fieldProps },
      password: { ...this.fieldProps },
      passwordConfirm: { ...this.fieldProps }
    }
    this.validateInput = debounce((inputName) => {
      const formInputs = { [inputName]: this.state[inputName].value }
      if (inputName.substr(0, 8) === 'password') {
        const secondInputName =
          inputName === 'password' ? 'passwordConfirm' : 'password'
        formInputs[secondInputName] = this.state[secondInputName].value
      }
      return this.validateInputs(formInputs)
    }, 800)
  }

  handleSubmit (event) {
    event.preventDefault()
    event.stopPropagation()
    if (this.formDataIsValid()) {
      authClient.account.create(this.getFormData(), response => {
        if (response.success) {
          window.location = '/'
        }
      })
    }
    return this.validateInputs(this.getFormData(), false)
  }

  formDataIsValid () {
    const invalidInputCount = Object.values(this.state)
      .map(fieldProps => fieldProps.isValid)
      .filter(isValid => !isValid).length
    return invalidInputCount === 0
  }

  getFormData () {
    const formData = Object.entries(this.state).reduce((acc, input) => {
      acc[input[0]] = input[1].value
      return acc
    }, {})
    return formData
  }

  render () {
    return (
      <div className='container'>
        <form className='auth-form' onSubmit={this.handleSubmit.bind(this)}>
          <p className='h5 mb-4'>Sign up</p>
          <div className='md-form'>
            <label htmlFor='full-name'>Full Name</label>
            <input
              id='full-name'
              className={this.state.name.inputClass}
              name='name'
              type='text'
              onChange={this.recordInput}
            />
            <div className={this.state.name.feedbackClass}>
              {this.state.name.feedback}
            </div>
          </div>
          <div className='md-form'>
            <label htmlFor='user-name'>User Name</label>
            <input
              id='user-name'
              className={this.state.userName.inputClass}
              name='userName'
              type='text'
              onChange={this.recordInput}
            />
            <div className={this.state.userName.feedbackClass}>
              {this.state.userName.feedback}
            </div>
          </div>
          <div className='md-form'>
            <label htmlFor='email'>Email</label>
            <input
              id='email'
              className={this.state.confirmEmail.inputClass}
              name='confirmEmail'
              type='text'
              onChange={this.recordInput}
            />
            <div className={this.state.confirmEmail.feedbackClass}>
              {this.state.confirmEmail.feedback}
            </div>
          </div>
          <div className='md-form'>
            <label htmlFor='password-field'>Password</label>
            <input
              id='password-field'
              className={this.state.password.inputClass}
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
            <label htmlFor='password-confirm'>Confirm Password</label>
            <input
              id='password-confirm'
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
          <button className='btn btn-primary' type='submit'>
            Sign Up
          </button>
        </form>
      </div>
    )
  }
}

export default SignUpForm
