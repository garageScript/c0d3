import React from 'react'
import { Redirect } from 'react-router'
import { Link } from 'react-router-dom'
import authClient from '../../helpers/auth/client'
import '../../css/AuthForm.css'

class SignInForm extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      username: '',
      password: null,
      formMessageClassName: 'alert',
      formMessageValue: ''
    }

    this.handleInputChange = this.handleInputChange.bind(this)
  }

  handleInputChange (event) {
    const value = event.target.value
    const name = event.target.name

    this.setState({
      [name]: value
    })
  }

  handleSubmit (event) {
    event.preventDefault()
    event.stopPropagation()
    return authClient.session.start(
      this.state.username,
      this.state.password,
      authResponse => {
        if (authResponse.success) {
          window.location = authResponse.userInfo.redirectPath || '/'
          return
        }
        return this.setState({
          formMessageClassName: 'alert alert-danger',
          formMessageValue: 'Incorrect username or password: please try again'
        })
      }
    )
  }

  render () {
    return (
      <div className='container'>
        <form className='auth-form' onSubmit={this.handleSubmit.bind(this)}>
          <p className='h5 mb-4'>Sign in</p>
          <div
            id='form-message'
            name='formMessage'
            className={this.state.formMessageClassName}
          >
            {this.state.formMessageValue}
          </div>
          <div className='md-form'>
            <label htmlFor='signin-user-name'>Username</label>
            <input
              id='signin-user-name'
              className='form-control'
              name='username'
              type='text'
              autoComplete='username'
              onChange={this.handleInputChange}
              value={this.state.username}
            />
          </div>
          <div className='md-form'>
            <label htmlFor='signin-password'>Password</label>
            <input
              id='signin-password'
              className='form-control'
              name='password'
              type='password'
              autoComplete='current-password'
              onChange={this.handleInputChange}
            />
          </div>
          <button className='btn btn-primary' type='submit'>
            Sign in
          </button>
          <Link to='/forgotpassword'>
          Forgot Password
          </Link>
        </form>
      </div>
    )
  }
}

const SignInPage = ({ signIn }) => {
  if (window.userInfo.auth) {
    return <Redirect to={window.userInfo.redirectPath || '/'} />
  }
  return <SignInForm />
}

export default SignInPage
