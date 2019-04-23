import React from 'react'

const ConfirmEmailComponent = () => {
  return (
    <div className='container'>
      <div className='auth-form' style={{ textAlign: 'center' }}>
        <p className='h5 mb-4'>Please confirm Email. If you have not received any emails, please check your spam folder, or resend again.</p>
        <button className='btn btn-primary'
          onClick={() => {
            // Next step is to add mutation here to resend email confirmation
          }}>Resend Confirmation Email</button>
      </div>
    </div>
  )
}

export default ConfirmEmailComponent
