/* global jest */

const axios = jest.genMockFromModule('axios')

axios.get = () => {}

module.exports = axios
