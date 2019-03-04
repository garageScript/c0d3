import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

class Announcements extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      announcement: ''
    }
  }
  render () {
    return (
      <div>
        <h1>Admin Page</h1>
        <h1>New Announcements</h1>
        <textarea className='newAnnouncement' value={this.state.announcement} onChange={(v) => {
          this.setState({
            announcement: v.target.value
          })
        }} />
        <Mutation mutation={gql`
           mutation create($input :String){
              createAnnouncement(value: $input) 
           } 
            `}>
          {(execute) => {
            return <button className='updateAnnouncement' onClick={() => {
              execute({
                variables: {
                  input: this.state.announcement
                }
              })
              this.setState({
                announcement: ''
              })
            }}>SUBMIT</button>
          }}
        </Mutation>
      </div>
    )
  }
}

export default Announcements
