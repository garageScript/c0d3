import React from 'react'
import { Query, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import Markdown from 'react-markdown'
import { GET_ANNOUNCEMENTS } from '../../db/queries.js'
import { loadComponent } from '../shared/shared.js'

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
              createAnnouncement(value: $input) {
                id,
                description
              } 
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
        <Query query={GET_ANNOUNCEMENTS} >
          { loadComponent((data) => {
            return data.announcements.map((v, i) => {
              return <Markdown key={i} source={v.description} />
            })
          })}
        </Query>
      </div>
    )
  }
}

export default Announcements
