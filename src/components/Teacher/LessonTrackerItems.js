import React from 'react'
import { Link } from 'react-router-dom'
import { Mutation } from 'react-apollo'

import TeacherToggle from './TeacherToggle'
import { ADOPT_STUDENT, UNADOPT_STUDENT } from '../../db/queries'

const getStatusClass = status => {
  // status could be: open, passed, needMoreWork, and underReview
  if (status === 'open') return 'bg-warning'
  if (status === 'passed') return 'bg-success'
  if (status === 'needMoreWork') return 'bg-danger'
  return 'bg-dark'
}

const LessonTrackerItems = ({
  lid,
  submissions,
  challenges,
  studentId,
  studentName,
  adoptedStudents,
  lessonStatus
}) => {
  const challengesCopy = [...challenges]
  const challengeBar = challengesCopy
    .sort((a, b) => a.order - b.order)
    .map((challengeInfo, index) => {
      const mapId = `u${studentId}c${challengeInfo.id}`
      const submission = submissions[mapId] || {}
      return (
        <Link
          target='_blank'
          rel='noopener noreferrer'
          key={index}
          className={getStatusClass(submission.status)}
          to={`/submissions/${lid}/${challengeInfo.id}`}
        >
          {index + 1}
        </Link>
      )
    })

  const submissionVar = {
    input: {
      lessonId: lid,
      userId: studentId
    }
  }

  const minusIcon = (
    <Mutation mutation={UNADOPT_STUDENT} variables={submissionVar}>
      {execute => (
        <button
          type='button'
          className='btn btn-deep-orange btn-sm'
          onClick={execute}
        >
          Abandon
        </button>
      )}
    </Mutation>
  )

  const plusIcon = (
    <Mutation mutation={ADOPT_STUDENT} variables={submissionVar}>
      {execute => (
        <button
          type='button'
          className='btn btn-blue-grey btn-sm'
          onClick={execute}
        >
          Adopt
        </button>
      )}
    </Mutation>
  )

  const adoptedStudentsObj = adoptedStudents.reduce(
    (result, item, index, array) => {
      result[item.id] = item
      return result
    },
    {}
  )

  const isAnAdoptedStudent =
    Object.values(adoptedStudentsObj).indexOf(adoptedStudentsObj[studentId]) >
    -1

  const iconToDisplay = isAnAdoptedStudent ? minusIcon : plusIcon

  const isTeaching = lessonStatus ? lessonStatus.isTeaching : null

  return (
    <div>
      <Link to={`/profile/${studentId}`}>{studentName}</Link>
      {iconToDisplay}
      <TeacherToggle isTeaching={isTeaching} lid={`${lid}`} studentId={`${studentId}`} />
      <div className='submission-container'>{challengeBar}</div>
      <hr />
    </div>
  )
}

export default LessonTrackerItems
