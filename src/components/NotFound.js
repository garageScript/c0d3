import React from 'react'

const NotFound = ({ location }) => {
  return (
    <div className='gs-container-1'>
      <h1 className='gs-h1'>Unable to find {location.pathname}</h1>
    </div>
  )
}

export default NotFound
