import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ApolloProvider, Query } from 'react-apollo'

import './css/App.css'
// components
// Enable when snippets are in graphQL
// import Snippets from './components/Snippets';
import Student from './components/Student'
import Teacher from './components/Teacher'
import Diff from './components/Diff'
import LessonList from './components/LessonList'
import SignIn from './components/Auth/SignIn'
import SignUp from './components/Auth/SignUp'
import Chat from './components/Chat/Chat'
import Profile from './components/UserProfile'
import NotFound from './components/NotFound'
import PrivateRoute from './components/Auth/PrivateRoute'
import AdminRoute from './components/Auth/AdminRoute'
import NavBar from './components/NavBar'
import UsersAdmin from './components/Admin/Users'
import LessonListAdmin from './components/Admin/LessonList'
import AdminAnnouncements from './components/Admin/Announcements'
import chatdb from './db/chatdb'
import Markdown from 'react-markdown'
import { GET_ANNOUNCEMENTS } from './db/queries.js'
import { loadComponent } from './components/shared/shared.js'
import { Settings } from './components/Auth/Settings'
import ForgotPassword from './components/Auth/ForgotPassword'
import CheckEmail from './components/Auth/CheckEmail'
import ResetPassword from './components/Auth/ResetPassword'
import ConfirmEmail from './components/Auth/ConfirmEmail'

const Home = () => {
  const reset = window.userInfo.mustReset
  if (reset) {
    window.location.assign(`${window.location}settings?reset=${reset}`)
  }
  return (
    <div>
      <div className='gs-container-2'>
        <div className='gs-body-space'>
          <h3 className='gs-h3'>General Announcements</h3>
          <h5 className='gs-h5'>
            Updates and Guidelines
            <div className='mt-1'>
              <small>
                To make space for other students on our servers, your account
                will be deleted after 30 days of inactivity.
              </small>
            </div>
            <div className='mt-1'>
              <small>
                Take each lesson challenge seriously and do them over and over
                again until you can solve them. With the exception of End to
                End, all challenges are questions and exercises taken from real
                interviews.
              </small>
            </div>
            <div className='mt-1'>
              <small>
                These lessons will not only prepare you for your interviews, but
                it will also help you teach you the skills that you need to
                become an effective engineer.
              </small>
            </div>
            <div className='mt-1'>
              <small>
                After completing Foundations of JavaScript, Variables &
                Functions, Arrays, Objects, End To End, HTML/CSS/JavaScript,
                React/GraphQL/SocketIO, you will be technically ready to
                contribute to our codebase.
              </small>
            </div>
          </h5>
          <Query className='announcements' query={GET_ANNOUNCEMENTS}>
            { loadComponent(({ announcements }) => {
              return announcements.map((v, i) => {
                return <Markdown key={i} source={v.description} />
              })
            })}
          </Query>
        </div>
      </div>
    </div>
  )
}

const AppElement = () => (
  <div className='App'>
    <ApolloProvider client={chatdb.getClient()}>
      <Router>
        <div>
          <NavBar />
          <Switch>
            <PrivateRoute exact path='/' component={Home} />
            <PrivateRoute path='/curriculum' component={LessonList} />
            <PrivateRoute path='/home' component={Home} />
            <PrivateRoute path='/student/:lid' component={Student} />
            <PrivateRoute path='/teacher/:lid' component={Teacher} />
            <PrivateRoute path='/chat/:id' component={Chat} />
            <PrivateRoute exact path='/profile' component={Profile} />
            <PrivateRoute exact path='/profile/:userId' component={Profile} />
            <AdminRoute path='/admin/announcements' component={AdminAnnouncements} />
            <AdminRoute exact path='/admin' component={LessonListAdmin} />
            <AdminRoute exact path='/admin/users' component={UsersAdmin} />
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
