import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import ConfirmEmailComponent from './ConfirmEmail'

const PrivateRoute = ({
  setRedirectPath,
  component: Component,
  ...otherProps
}) => {
  let renderRoute = props =>
    window.userInfo.id ? <Component {...props} /> : <Redirect to='/signin' />
  if (window.userInfo.emailVerification) {
    renderRoute = props => <ConfirmEmailComponent />
  }
  return <Route {...otherProps} render={renderRoute} />
}

export default PrivateRoute
