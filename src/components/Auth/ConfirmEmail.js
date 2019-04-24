import React from 'react'
import { Mutation } from 'react-apollo'
import { withRouter } from 'react-router'
import { RESEND_EMAIL_CONFIRMATION } from '../../db/queries'

class ConfirmEmailComponent extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      resentEmail: false
    }
  }
  render () {
    if (this.state.resentEmail) {
      return (
        <div className='container'>
          <div className='auth-form'>
            <p className='h5 mb-4'>Email re-sent, please confirm email and sign back in. If you have not received any emails, please check your spam folder.</p>
          </div>
        </div>
      )
    }
    return (
      <div className='container'>
        <div className='auth-form'>
          <p className='h5 mb-4'>Please confirm email and sign back in. If you have not received any emails, please check your spam folder, or resend again.</p>
          <Mutation mutation={RESEND_EMAIL_CONFIRMATION} >
            {(execute) => {
              return (
                <div style={{ textAlign: 'center' }}>
                  <button className='btn btn-primary'
                    onClick={() => {
                      execute({
                        variables: {
                          input: window.userInfo.username
                        }
                      }).then(() => {
                        this.setState({
                          resentEmail: true
                        })
                      })
                    }}>Resend Confirmation Email</button>
                </div>
              )
            }}
          </Mutation>
        </div>
      </div>
    )
  }
}

const ConfirmEmail = withRouter(ConfirmEmailComponent)
export default ConfirmEmail
