import React from 'react'
import SignIn from './SignIn'
import { mount, configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

it('renders without crashing', () => {
  global.userInfo = {}
  const element = mount(<SignIn />)
  const input = element.find('#signin-user-name')
  input.simulate('change', {
    target: {
      value: 'abc',
      name: 'username'
    }
  })
  expect(input.instance().value).toEqual('abc')
})
