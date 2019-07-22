import React, { useState } from 'react'
import { Mutation } from 'react-apollo'
import {
  SAVE_LESSON,
  CREATE_LESSON,
  SAVE_CHALLENGE,
  CREATE_CHALLENGE,
  DELETE_LESSON,
  DELETE_CHALLENGE,
  getLessonListContainer
} from '../../db/queries.js'
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
const DefaultComponent = ({ onClick, lesson, challengeForms }) => (
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
        onClick={onClick}
      >
          Add New Challenge
      </button>
    </div>
    <div>{ challengeForms }</div>
  </div>
)

// component below displays when user adds a new lesson or challenge
const AddNewComponent = ({ lesson, componentType, setAddNew }) => {
  let title = `Add new challenge to ${lesson.title}!`
  let mutationCall = CREATE_CHALLENGE
  let lid = lesson.id
  let fields = ADD_NEW_CHALLENGE

  if (componentType === 'lesson') {
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
              setAddNew={setAddNew}
            />
          </div>
        )}
      </Mutation>
    </div>
  )
}

const LessonList = ({ lessons }) => {
  const [addNew, setAddNew] = useState(false)
  const [lessonIndex, setLessonIndex] = useState(0)
  const [componentType, setComponentType] = useState('')
  const lesson = lessons[lessonIndex]

  const addNewChallenge = () => {
    setAddNew(true)
    setComponentType('challenge')
  }
  const addNewLesson = () => {
    setAddNew(true)
    setComponentType('lesson')
  }
  const selectLesson = (index) => () => {
    setLessonIndex(index)
    setAddNew(false)
  }

  const lessonLinks = lessons.map((lesson, index) => (
    <button
      key={index}
      className='list-group-item list-group-item-action waves-effect'
      onClick={selectLesson(index)}
    >
      { lesson.title }
    </button>
  ))

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

  const componentToDisplay = addNew
    ? (
      <AddNewComponent
        setAddNew={setAddNew}
        lesson={lesson}
        componentType={componentType}
      />
    )
    : (
      <DefaultComponent
        onClick={addNewChallenge}
        lesson={lesson}
        challengeForms={challengeForms}
      />
    )

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
}

export default getLessonListContainer(loadComponent(LessonList))
