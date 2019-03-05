/* global alert */
import axios from 'axios'

const client = {
  authServer: process.env.REACT_APP_SERVER_URL,
  reqConf: { withCredentials: true },
  session: {
    getInfo: async callback => {
      try {
        const url = `${client.authServer}/session`
        const response = await axios.get(url, client.reqConf)
        callback(response.data)
      } catch (err) {
        callback(err)
      }
    },
    start: async (username, password, callback) => {
      try {
        const url = `${client.authServer}/signin`
        const data = { username, password }
        const response = await axios.post(url, data, client.reqConf)
        callback(response.data)
      } catch (err) {
        if (err.response.data) return callback(err.response.data)
        console.log(err)
      }
    },
    end: async callback => {
      try {
        const url = `${client.authServer}/signout`
        await axios.get(url, client.reqConf)
        callback()
      } catch (err) {
        console.log(err)
      }
    }
  },
  account: {
    create: async (fieldInputs, callback) => {
      try {
        const url = `${client.authServer}/signup`
        const response = await axios.post(url, { fieldInputs }, client.reqConf)
        callback(response.data)
      } catch (err) {
        console.log(err)
      }
    },
    updatePassword: async fieldInputs => {
      try {
        const url = `${client.authServer}/password`
        await axios.post(url, fieldInputs, client.reqConf)
        alert('success!')
      } catch (err) {
        alert('error')
        console.log(err)
      }
    }
  },
  validator: async (formName, fieldInputs, context, callback) => {
    try {
      const url = `${client.authServer}/validate`
      const data = { formName, fieldInputs, context }
      const response = await axios.post(url, data)
      callback(response.data.result)
    } catch (err) {
      console.log(err)
    }
  },
  form: {
    getDef: async (formName, callback) => {
      try {
        const url = `${client.authServer}/clientform`
        const data = { formName }
        const response = await axios.post(url, data)
        callback(response.data.result)
      } catch (err) {
        callback([])
      }
    }
  }
}

export default client
