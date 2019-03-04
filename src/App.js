import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { ApolloProvider } from 'react-apollo'

import './css/App.css'
// components
// Enable when snippets are in graphQL
// import Snippets from './components/Snippets';
import Student from './components/Student'
import Teacher from './components/Teacher'
import Diff from './components/Diff'
import LessonList from './components/LessonList'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Chat from './components/Chat/Chat'
import Profile from './components/UserProfile'
import NotFound from './components/NotFound'
import PrivateRoute from './components/PrivateRoute'
import NavBar from './components/NavBar'
import LessonListAdmin from './components/Admin/LessonList'
import AdminAnnouncements from './components/Admin/Announcements'
import chatdb from './db/chatdb'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import Markdown from 'react-markdown'

const Home = () => {
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
          <Query className='announcements' query={gql`
                  query {
                    announcements {
                      id, 
                      description
                    }
                  }
                `}
          >
            {(params) => {
              if (params.loading) return <h1>Loading...</h1>
              if (params.error) return <h1>Error</h1>
              return params.data.announcements.map((v, i) => {
                return <Markdown key={i} source={v.description} />
              })
            }}
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
            <Route exact path='/' component={Home} />
            <PrivateRoute path='/curriculum' component={LessonList} />
            <PrivateRoute path='/home' component={Home} />
            <PrivateRoute path='/student/:lid' component={Student} />
            <PrivateRoute path='/teacher/:lid' component={Teacher} />
            <PrivateRoute path='/chat/:id' component={Chat} />
            <PrivateRoute exact path='/profile' component={Profile} />
            <PrivateRoute exact path='/profile/:userId' component={Profile} />
            <PrivateRoute path='/admin/announcements' component={AdminAnnouncements} />
            <PrivateRoute path='/admin' component={LessonListAdmin} />
            <PrivateRoute
              path='/admin/lessons/new'
              component={LessonListAdmin}
            />
            <PrivateRoute path='/submissions/:lid/:cid' component={Diff} />
            <Route path='/signup' component={SignUp} />
            <Route path='/signin' component={SignIn} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </Router>
    </ApolloProvider>
  </div>
)

export default AppElement
