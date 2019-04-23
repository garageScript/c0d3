import React from 'react'
import { Mutation } from 'react-apollo'
import { RESEND_EMAIL_CONFIRMATION } from '../../db/queries'

const ConfirmEmailComponent = ({ history }) => {
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
                      history.push('/resendEmail')
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

export default ConfirmEmailComponent
