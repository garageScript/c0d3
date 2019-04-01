import React from 'react'
import ReactDOM from 'react-dom'
import './css/index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { loadUserInfo } from './helpers/auth/actions'
import chatdb from './db/chatdb'

loadUserInfo(() => {
  const userInfo = { ...window.userInfo }

  // TODO: Remove hack. Replace all instances of userName with username
  userInfo.userName = userInfo.username

  if (userInfo && userInfo.id) {
    chatdb.startSocket(userInfo)
  }

  if ((!userInfo || !userInfo.userName) && window.location.pathname === '/') {
    return
  }

  ReactDOM.render(<App />, document.getElementById('root'))
})

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
