import React from 'react'
import {
  LESSONS,
  ADMIN_STATE,
  SAVE_LESSON,
  CREATE_LESSON,
  SAVE_CHALLENGE,
  CREATE_CHALLENGE,
  DELETE_LESSON,
  DELETE_CHALLENGE
} from '../../db/queries.js'
import { Query, Mutation } from 'react-apollo'
import EditableInput from './EditableInput'
import { loadComponent } from '../shared/shared'

const NewLessonPage = () => {
  return (
    <Query query={ADMIN_STATE}>
      {res => {
        return (
          <Query query={LESSONS}>
            {loadComponent(data => {
              const lessonLinks = data.lessons.map((lesson, index) => {
                return (
                  <div key={index}>
                    <a
                      onClick={() => {
                        res.client.writeData({
                          data: {
                            lessonIndex: index,
                            addNew: false
                          }
                        })
                      }}
                      className='list-group-item list-group-item-action waves-effect'
                    >
                      {lesson.title}
                    </a>
                  </div>
                )
              })

              // specific lesson data user has selected
              const lesson = data.lessons[res.data.lessonIndex]

              // list of forms for each challenge for a specific lesson
              const challengeForms = lesson.challenges.map((challenge, ci) => {
                return (
                  <Mutation key={ci} mutation={SAVE_CHALLENGE}>
                    {(saveChallenge, { calledSaveChallenge }) => {
                      return (
                        <Mutation mutation={DELETE_CHALLENGE}>
                          {(deleteChallenge, { calledDeleteChallenge }) => {
                            return (
                              <EditableInput
                                key={challenge.id}
                                id={challenge.id}
                                lid={lesson.id}
                                fields={[
                                  { label: 'title', type: 'text' },
                                  { label: 'order', type: 'text' },
                                  { label: 'description', type: 'textarea' }
                                ]}
                                values={challenge}
                                onSave={saveChallenge}
                                onDelete={deleteChallenge}
                              />
                            )
                          }}
                        </Mutation>
                      )
                    }}
                  </Mutation>
                )
              })

              // component below displays when user first goes into admin page
              const DefaultComponent = () => {
                return (
                  <div>
                    <div>
                      <center>
                        <h2>Lesson</h2>
                      </center>
                    </div>
                    <div>
                      <Mutation mutation={SAVE_LESSON}>
                        {(saveLesson, { calledSaveLesson }) => {
                          return (
                            <Mutation mutation={DELETE_LESSON}>
                              {(deleteLesson, { calledDeleteLesson }) => {
                                return (
                                  <EditableInput
                                    key={lesson.id}
                                    id={lesson.id}
                                    fields={[
                                      { label: 'title', type: 'text' },
                                      {
                                        label: 'description',
                                        type: 'textarea'
                                      },
                                      { label: 'docUrl', type: 'text' },
                                      { label: 'githubUrl', type: 'text' },
                                      { label: 'videoUrl', type: 'text' },
                                      { label: 'order', type: 'text' }
                                    ]}
                                    values={lesson}
                                    onSave={saveLesson}
                                    onDelete={deleteLesson}
                                  />
                                )
                              }}
                            </Mutation>
                          )
                        }}
                      </Mutation>
                    </div>
                    <div>
                      <center>
                        <h2>Challenges</h2>
                        <button
                          className='btn btn-sm blue lighten-1 gs-button'
                          onClick={() => {
                            res.client.writeData({
                              data: {
                                addNew: true,
                                componentType: 'challenge'
                              }
                            })
                          }}
                        >
                          Add New Challenge
                        </button>
                      </center>
                    </div>
                    <div>{challengeForms}</div>
                  </div>
                )
              }

              // component below displays when user adds a new lesson or challenge
              const AddNewComponent = () => {
                let title
                let mutationCall
                let lid
                let fields

                if (res.data.componentType === 'lesson') {
                  title = 'ADD NEW LESSON'
                  mutationCall = CREATE_LESSON
                  lid = null
                  fields = [
                    { label: 'title', type: 'text' },
                    { label: 'description', type: 'textarea' },
                    { label: 'docUrl', type: 'text' },
                    { label: 'githubUrl', type: 'text' },
                    { label: 'videoUrl', type: 'text' },
                    { label: 'order', type: 'text' }
                  ]
                } else {
                  title = `Add new challenge to ${lesson.title}!`
                  lid = lesson.id
                  mutationCall = CREATE_CHALLENGE
                  fields = [
                    { label: 'title', type: 'text' },
                    { label: 'description', type: 'textarea' },
                    { label: 'order', type: 'text' }
                  ]
                }

                return (
                  <div>
                    <Mutation mutation={mutationCall}>
                      {(add, { calledAdd }) => {
                        return (
                          <div>
                            <div>
                              <center>
                                <h2>{title}</h2>
                              </center>
                            </div>
                            <EditableInput
                              key={lesson.id}
                              id={lesson.id}
                              lid={lid}
                              fields={fields}
                              values={{}}
                              onSave={add}
                              client={res.client}
                            />
                          </div>
                        )
                      }}
                    </Mutation>
                  </div>
                )
              }

              const componentToDisplay = res.data.addNew ? (
                <AddNewComponent />
              ) : (
                <DefaultComponent />
              )

              return (
                <div>
                  <div className='gs-container-1'>Admin users only.</div>
                  <div className='gs-container-2'>
                    <div className='row'>
                      <div className='col-4'>
                        <center>
                          <button
                            className='btn btn-sm blue lighten-1 gs-button'
                            onClick={() => {
                              res.client.writeData({
                                data: {
                                  addNew: true,
                                  componentType: 'lesson'
                                }
                              })
                            }}
                          >
                            Add New Lesson
                          </button>
                        </center>
                        <div className='list-group'>{lessonLinks}</div>
                      </div>
                      <div className='col-8'>
                        <div>{componentToDisplay}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </Query>
        )
      }}
    </Query>
  )
}

const NewLesson = NewLessonPage
export default NewLesson
