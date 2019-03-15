import React from 'react'
import { Query, Mutation } from 'react-apollo'

import {
  GIVE_STAR,
  STAR_RECIPIENT,
  LESSON_STATUS,
  TEACHERS
} from '../db/queries'
import { loadComponent } from './shared/shared'

const Teachers = ({ clientState, lessonInfo, selectUser }) => (
  <Query query={TEACHERS} variables={{ in: { id: lessonInfo.id } }}>
    {loadComponent(({ teachers }) => {
      return (
        <div>
          {teachers.map((teacher, i) => {
            const style = { cursor: 'pointer' }
            if (clientState.data.starRecipent === teacher.username) {
              style.backgroundColor = 'lightgreen'
            }

            return (
              <div
                key={i}
                onClick={() => {
                  selectUser(teacher.id)
                  clientState.client.writeData({
                    data: { starRecipent: teacher.username }
                  })
                }}
                style={style}
              >
                {teacher.username}
              </div>
            )
          })}
          <div
            onClick={execute => {
              selectUser(0)
              clientState.client.writeData({
                data: { starRecipent: 0 }
              })
            }}
            style={{
              cursor: 'pointer',
              backgroundColor:
                clientState.data.starRecipent === 0 ? 'lightgreen' : null
            }}
          >
            No one helped me
          </div>
        </div>
      )
    })}
  </Query>
)

const CongratsModal = ({ lessonInfo }) => {
  const selected = {}
  return (
    <Query query={LESSON_STATUS} variables={{ in: { id: lessonInfo.id } }}>
      {({ loading, error, data }) => {
        if (error || loading) return ''
        if (!data || !data.lessonStatus) return ''
        if (
          !data.lessonStatus.isTeaching ||
          !data.lessonStatus.isPassed ||
          data.lessonStatus.starGiven
        ) { return '' } 

        return (
          <div
            className='modal fade show'
            id='basicExampleModal'
            tabIndex='-1'
            role='dialog'
            aria-labelledby='exampleModalLabel'
            style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.8)' }}
          >
            <Query query={STAR_RECIPIENT}>
              {clientState => {
                return (
                  <div className='modal-dialog' role='document'>
                    <div className='modal-content'>
                      <div className='modal-header'>
                        <h5 className='modal-title' id='exampleModalLabel'>
                          Congratulation on passing {lessonInfo.title}
                        </h5>
                      </div>
                      <div
                        className='modal-body'
                        style={{ height: '200px', overflow: 'auto' }}
                      >
                        <h5>Who helped you the most?</h5>
                        <Teachers
                          clientState={clientState}
                          lessonInfo={lessonInfo}
                          selected={selected}
                          selectUser={uid => {
                            selected.userId = uid
                          }}
                        />
                      </div>
                      <div className='modal-footer'>
                        <Mutation mutation={GIVE_STAR}>
                          {execute => {
                            const starRecipent =
                              clientState.data.starRecipent || 'no one'
                            return (
                              <div>
                                <textarea />
                                <button
                                  type='button'
                                  className='btn btn-default btn-lg btn-block'
                                  data-dismiss='modal'
                                  aria-label='Close'
                                  onClick={() => {
                                    execute({
                                      variables: {
                                        in: {
                                          lessonId: lessonInfo.id,
                                          userId: selected.userId,
                                          comment: 'good job!'
                                        }
                                      }
                                    }).then(() => window.location.reload())
                                    // TODO: close the modal in a more classy way
                                  }}
                                >
                                  <span aria-hidden='true'>
                                  Give Star to {starRecipent}
                                  </span>
                                </button>
                              </div>
                            )
                          }}
                        </Mutation>
                      </div>
                    </div>
                  </div>
                )
              }}
            </Query>
          </div>
        )
      }}
    </Query>
  )
}

export default CongratsModal
