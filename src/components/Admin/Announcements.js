import React from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Markdown from 'react-markdown'

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
        <Query query={gql`
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
    )
  }
}

export default Announcements
