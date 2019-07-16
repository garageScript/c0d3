import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import Markdown from 'react-markdown'
import {
  GET_ANNOUNCEMENTS,
  DELETE_ANNOUNCEMENT,
  CREATE_ANNOUNCEMENT,
  getAnnouncementsContainer
} from '../../db/queries.js'
import { loadComponent, cacheUpdate } from '../shared/shared.js'
import MarkdownComponent from '../shared/Markdown.js'

const Announcements = ({ announcements }) => {
  const [announcement, setAnnouncement] = useState('')
  return (
    <div >
      <h1 style={{ textAlign: 'center' }}>Admin Page</h1>
      <div className='container' >
        <h4 >New Announcements: </h4>
        <div style={{ width: '100%', height: '200px' }}>
          <MarkdownComponent
            value={announcement}
            onChange={input => setAnnouncement(input)}
          />

        </div>
        <Mutation update={
          cacheUpdate(GET_ANNOUNCEMENTS, ({
            createAnnouncement }, { announcements }) => {
            return {
              announcements: [createAnnouncement].concat(announcements)
            }
          })} mutation={CREATE_ANNOUNCEMENT}>
          {(execute) => {
            return (
              <div>
                <button className='btn btn-success' style={{ margin: '10px 0px 10px 0px' }} onClick={() => {
                  execute({ variables: { input: announcement } })
                  setAnnouncement('')
                }}>SUBMIT</button>
              </div>
            )
          } }
        </Mutation>
      </div>
      <div className='container'>
        { announcements.map((v, i) => {
          return (
            <div key={v.id}>
              <Markdown key={i} source={v.description} />
              <Mutation update={cacheUpdate(GET_ANNOUNCEMENTS, ({ deleteAnnouncement }) => {
                return {
                  announcements: deleteAnnouncement
                }
              })} mutation={DELETE_ANNOUNCEMENT}>
                { (execute) => {
                  return <button className='deleteAnnouncement' onClick={() => {
                    execute({
                      variables: {
                        input: v.id
                      }
                    })
                  }}>DELETE</button>
                } }
              </Mutation>
              <hr />
            </div>
          )
        })
        }
      </div>
    </div>
  )
}

export default getAnnouncementsContainer(loadComponent((Announcements)))
