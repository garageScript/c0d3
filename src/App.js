import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'

import './css/App.css'
// components
// Enable when snippets are in graphQL
// import Snippets from './components/Snippets';
import Home from './components/Home'
import Student from './components/Student'
import Teacher from './components/Teacher'
import Diff from './components/Diff'
import LessonList from './components/LessonList'
import SignIn from './components/Auth/SignIn'
import SignUp from './components/Auth/SignUp'
import Profile from './components/UserProfile'
import NotFound from './components/NotFound'
import PrivateRoute from './components/Auth/PrivateRoute'
import AdminRoute from './components/Auth/AdminRoute'
import NavBar from './components/NavBar'
import UsersAdmin from './components/Admin/Users'
import LessonListAdmin from './components/Admin/LessonList'
import AdminAnnouncements from './components/Admin/Announcements'
import { Settings } from './components/Auth/Settings'
import ForgotPassword from './components/Auth/ForgotPassword'
import CheckEmail from './components/Auth/CheckEmail'
import ResetPassword from './components/Auth/ResetPassword'
import ConfirmEmail from './components/Auth/ConfirmEmail'
import Waitlist from './components/Admin/Waitlist'

import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { withClientState } from 'apollo-link-state'
import { ApolloLink } from 'apollo-link'

const serverDB = process.env.REACT_APP_SERVER_URL

const cache = new InMemoryCache()

const stateLink = withClientState({
  cache,
  defaults: {
    starRecipent: '',
    adoptedStudentFilter: false,
    lessonOrder: 500,
    challengeIndex: 0
  }
})

const client = new ApolloClient({
  link: ApolloLink.from([
    stateLink,
    new HttpLink({
      credentials: 'include',
      uri: `${serverDB}/graphql`
    })
  ]),
  cache
})

const AppElement = () => (
  <div className='App'>
    <ApolloProvider client={client}>
      <Router>
        <div>
          <NavBar />
          <Switch>
            <PrivateRoute exact path='/' component={Home} />
            <PrivateRoute path='/curriculum' component={LessonList} />
            <PrivateRoute path='/home' component={Home} />
            <PrivateRoute path='/student/:lid' component={Student} />
            <PrivateRoute path='/teacher/:lid' component={Teacher} />
            <PrivateRoute exact path='/profile' component={Profile} />
            <PrivateRoute exact path='/profile/:userId' component={Profile} />
            <AdminRoute path='/admin/announcements' component={AdminAnnouncements} />
            <AdminRoute exact path='/admin' component={LessonListAdmin} />
            <AdminRoute exact path='/admin/users' component={UsersAdmin} />
            <AdminRoute exact path='/admin/waitlist' component={Waitlist} />
            <AdminRoute
              path='/admin/lessons/new'
              component={LessonListAdmin}
            />
            <PrivateRoute path='/submissions/:lid/:cid' component={Diff} />
            <PrivateRoute path='/settings' component={Settings} />
            <Route exact path='/signup' component={SignUp} />
            <Route exact path='/signin' component={SignIn} />
            <Route exact path='/forgotpassword' component={ForgotPassword} />
            <Route exact path='/checkemail' component={CheckEmail} />
            <Route exact path='/resetpassword/:token' component={ResetPassword} />
            <PrivateRoute path='/confirmEmail' component={ConfirmEmail} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  </div>
)

export default AppElement
