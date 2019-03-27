import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({
  setRedirectPath,
  component: Component,
  ...otherProps
}) => {
  const renderRoute = props =>
    window.userInfo.id ? <Component {...props} /> : <Redirect to='/signin' />
  return <Route {...otherProps} render={renderRoute} />
}

export default PrivateRoute
