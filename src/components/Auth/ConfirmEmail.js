import React from 'react'
import { withRouter } from 'react-router'

const EmailConfirmed = ({ props }) => {
  return (
    <div>
      <p className='h5 mb-4'>Your Email is Confirmed!</p>
      <p>
Please go to the sign in page and log in with your credentials
      </p>
      <button className='btn btn-primary'
        onClick={() => {
          props.history.push('/signin')
        }}>Sign In Page</button>
    </div>
  )
}

class ConfirmEmailComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      emailVerified: this.props.match.params.token
    }
  }
  render () {
    if (!this.state.emailVerified) {
      return (
        <div className='container'>
          <div className='auth-form' style={{ textAlign: 'center' }}>
            <p className='h5 mb-4'>Email needs to be confirmed!</p>
            <button className='btn btn-primary'
              onClick={() => {
                // Next step is to add mutation here to resend email confirmation
              }}>Resend Confirmation Email</button>
          </div>
        </div>
      )
    }
    return (
      <div className='container'>
        <div className='auth-form'>
          <EmailConfirmed props={this.props} />
        </div>
      </div>
    )
  }
}

const ConfirmEmail = withRouter(ConfirmEmailComponent)
export default ConfirmEmail
