import client from './client'
import { garageScript as defaultUserInfo } from './defaultUserInfo'

const { session, account, validator } = client
const location = window.location

export const loadUserInfo = callback => {
  session.getInfo(({ userInfo }) => {
    window.userInfo = userInfo
      ? { ...defaultUserInfo, ...userInfo }
      : { ...defaultUserInfo }

    callback()
  })
}

export const signIn = (username, password) => {
  session.start(username, password, ({ userInfo }) => {
    if (userInfo) location.pathName = window.userInfo.redirectPath
  })
}

export const signOut = () => {
  session.end(() => location.reload())
}

export const signUp = formData => {
  account.create(formData, ({ success }) => {
    if (success) signIn(formData.username, formData.password)
  })
}

export const validate = validator

export const setRedirectPath = path => {
  window.userInfo.redirectPath = path
}
