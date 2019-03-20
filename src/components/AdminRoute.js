import React from 'react'
import { Route, Redirect } from 'react-router-dom'

const AdminRoute = ({
  setRedirectPath,
  component: Component,
  ...otherProps
}) => {
  const renderRoute = props => {
    if (!window.userInfo.id) {
      return <Redirect to='/signin' />
    } else if (!window.userInfo.isAdmin) {
      return <Redirect to='/' />
    } else {
      return <Component {...props} />
    }
  }
  return <Route {...otherProps} render={renderRoute} />
}
export default AdminRoute
