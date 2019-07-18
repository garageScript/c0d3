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

const ADD_NEW_LESSON = [
  { label: 'title', type: 'text' },
  { label: 'description', type: 'textarea' },
  { label: 'docUrl', type: 'text' },
  { label: 'githubUrl', type: 'text' },
  { label: 'videoUrl', type: 'text' },
  { label: 'chatUrl', type: 'text' },
  { label: 'order', type: 'text' }
]
const ADD_NEW_CHALLENGE = [
  { label: 'title', type: 'text' },
  { label: 'order', type: 'text' },
  { label: 'description', type: 'textarea' }
]

// component below displays when user first goes into admin page
const DefaultComponent = ({ res, lesson, challengeForms }) => {
  const addNewChallenge = () => {
    res.client.writeData({
      data: {
        addNew: true,
        componentType: 'challenge'
      }
    })
  }

  return (
    <div>
      <h2 className='text-center'>Lesson</h2>
      <div>
        <Mutation mutation={SAVE_LESSON}>
          {(saveLesson, { calledSaveLesson }) => (
            <Mutation mutation={DELETE_LESSON}>
              {(deleteLesson, { calledDeleteLesson }) => (
                <EditableInput
                  key={lesson.id}
                  id={lesson.id}
                  fields={ADD_NEW_LESSON}
                  values={lesson}
                  onSave={saveLesson}
                  onDelete={deleteLesson}
                />
              )}
            </Mutation>
          )}
        </Mutation>
      </div>
      <div className='text-center'>
        <h2 className='text-center'>Challenges</h2>
        <button
          className='btn btn-sm blue lighten-1 gs-button'
          onClick={addNewChallenge}
        >
          Add New Challenge
        </button>
      </div>
      <div>{ challengeForms }</div>
    </div>
  )
}

// component below displays when user adds a new lesson or challenge
const AddNewComponent = ({ lesson, res }) => {
  let title = `Add new challenge to ${lesson.title}!`
  let mutationCall = CREATE_CHALLENGE
  let lid = lesson.id
  let fields = ADD_NEW_CHALLENGE

  if (res.data.componentType === 'lesson') {
    title = 'ADD NEW LESSON'
    mutationCall = CREATE_LESSON
    lid = null
    fields = ADD_NEW_LESSON
  }

  return (
    <div>
      <Mutation mutation={mutationCall}>
        { (add, { calledAdd }) => (
          <div>
            <h2 className='text-center'>{ title }</h2>
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
        )}
      </Mutation>
    </div>
  )
}

const LessonList = () => {
  return (
    <Query query={ADMIN_STATE}>
      { res => {
        const handleLesson = (index) => () => {
          res.client.writeData({
            data: {
              lessonIndex: index,
              addNew: false
            }
          })
        }

        return (
          <Query query={LESSONS}>
            { loadComponent(data => {
              // specific lesson data user has selected
              const lesson = data.lessons[res.data.lessonIndex]
              const lessonLinks = data.lessons.map((lesson, index) => (
                <button
                  key={index}
                  className='list-group-item list-group-item-action waves-effect'
                  onClick={handleLesson(index)}
                >
                  { lesson.title }
                </button>
              ))
              const addNewLesson = () => res.client.writeData({
                data: {
                  addNew: true,
                  componentType: 'lesson'
                }
              })

              // list of forms for each challenge for a specific lesson
              const challengeForms = lesson.challenges.map((challenge, ci) => (
                <Mutation key={ci} mutation={SAVE_CHALLENGE}>
                  {(saveChallenge, { calledSaveChallenge }) => (
                    <Mutation mutation={DELETE_CHALLENGE}>
                      {(deleteChallenge, { calledDeleteChallenge }) => (
                        <EditableInput
                          key={challenge.id}
                          id={challenge.id}
                          lid={lesson.id}
                          fields={ADD_NEW_CHALLENGE}
                          values={challenge}
                          onSave={saveChallenge}
                          onDelete={deleteChallenge}
                        />
                      )}
                    </Mutation>
                  )}
                </Mutation>
              ))

              const componentToDisplay = res.data.addNew
                ? <AddNewComponent res={res} lesson={lesson} />
                : <DefaultComponent
                  res={res}
                  lesson={lesson}
                  challengeForms={challengeForms}
                />

              return (
                <div>
                  <div className='gs-container-1'>Admin users only.</div>
                  <div className='gs-container-2'>
                    <div className='row'>
                      <div className='col-4 text-center'>
                        <button
                          className='btn btn-sm blue lighten-1 gs-button'
                          onClick={addNewLesson}
                        >
                          Add New Lesson
                        </button>
                        <div className='list-group'>{ lessonLinks }</div>
                      </div>
                      <div className='col-8'>
                        <div>{ componentToDisplay }</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            }) }
          </Query>
        )
      } }
    </Query>
  )
}

export default LessonList
