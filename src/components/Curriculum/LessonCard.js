import React from 'react'
import { Link } from 'react-router-dom'
import { PendingSubmits } from './PendingSubmits'
import './lessoncard.css'

const colors = [
  {
    mid: '#90ee90', // Green
    dark: '#008000'
  },
  {
    mid: '#add8e6', // Blue
    dark: '#0000ff'
  },
  {
    mid: '#cc99cc', // Indigo
    dark: '#800080'
  },
  {
    mid: '#ffc0cb', // Pink
    dark: '#ff69b4'
  },
  {
    mid: '#ff9955', // Orange
    dark: '#ffa500'
  },
  {
    mid: '#FF5C5C', // Red
    dark: '#ff0000'
  }
]

const ColorOrder = ({ order }) => (
  <div
    className='gs-order'
    style={{
      backgroundColor: colors[order % colors.length].dark,
      border: `5px solid ${colors[order % colors.length].mid}`
    }}
  >
    <div>{order}</div>
  </div>
)

const LessonCard = ({
  lesson: { id, title, description, order, currentUser },
  cardType
}) => {
  const loggedInUser = currentUser
  const lessonStatus = loggedInUser
    ? loggedInUser.userLesson
    : { isTeaching: null, isPassed: null }
  const { isTeaching, isPassed } = lessonStatus
  return (
    <div
      className={`card gs-lesson-card ${cardType} ${isPassed ? 'passed' : ''}`}
    >
      {isTeaching ? (
        <div className='gs-card-badge badge blue-grey darken-1'>Teacher</div>
      ) : null}
      <div className='card-body'>
        <div className='row'>
          <div className='col-2 gs-order-container'>
            <ColorOrder order={order} />
          </div>
          <div className='col'>
            <p className='card-title'>{`${title} `}</p>
            <p className='card-text'>{description}</p>
            <Link to={`/${isTeaching ? 'teacher' : 'student'}/${id}`}>
              {cardType === 'small' && isPassed
                ? 'Review student submissions'
                : 'Continue'}
            </Link>
            <PendingSubmits id={id} isPassed={isPassed} />
          </div>
        </div>
      </div>
    </div>
  )
}

const FirstLesson = ({ lesson }) => {
  if (!lesson) { return <h3>Congratulations, you have finished all the lessons</h3> }
  const { id, order, title, description } = lesson
  return (
    <div className={`card gs-lesson-card`}>
      <div className='card-body'>
        <div className='row'>
          <div className='col-2 gs-order-container'>
            <ColorOrder order={order} />
          </div>
          <div className='col-8'>
            <p className='card-title'>{`${title} `}</p>
            <p className='card-text'>{description}</p>
          </div>
          <div className='col-2'>
            <Link to={`/student/${id}`}>
              <button className='btn btn-success'>Continue</button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export { LessonCard, FirstLesson }
