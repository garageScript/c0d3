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
        <Mutation update={(cache, { data: { createAnnouncement } }) => {
          const { announcements } = cache.readQuery({ query: GET_ANNOUNCEMENTS })
          cache.writeQuery({
            query: GET_ANNOUNCEMENTS,
            data: {
              announcements: [createAnnouncement].concat(announcements)
            }
          })
        }} mutation={gql`
           mutation create($input: String){
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
          { loadComponent(({ announcements }) => {
            return announcements.map((v, i) => {
              return <div>
                <Markdown key={i} source={v.description} />
                <Mutation mutation={gql`
                      mutation delete($input: String){
                        deleteAnnouncement(value: $input) {
                          id,
                          description
                        }
                      }
                    `}>
                  {(execute) => {
                    return <button className='deleteAnnouncement' onClick={() => {
                      execute({
                        variables: {
                          input: v.id
                        }
                      })
                    }}>DELETE</button>
                  }}
                </Mutation>
                <hr />
              </div>
            })
          })}
        </Query>
      </div>
    )
  }
}

export default Announcements
