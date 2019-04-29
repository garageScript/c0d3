import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import ConfirmEmailComponent from './ConfirmEmail'

const PrivateRoute = ({
  setRedirectPath,
  component: Component,
  ...otherProps
}) => {
  if (window.userInfo.emailVerificationToken) {
    return <Route {...otherProps} render={ConfirmEmailComponent} />
  }
  const renderRoute = props =>
    window.userInfo.id ? <Component {...props} /> : <Redirect to='/signin' />
  return <Route {...otherProps} render={renderRoute} />
}

export default PrivateRoute
