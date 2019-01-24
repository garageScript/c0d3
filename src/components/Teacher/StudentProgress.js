import React from 'react'
import { Query } from 'react-apollo'
import LessonTrackerItems from './LessonTrackerItems'
import { LESSON_INFO } from '../../db/queries'
import { loadComponent } from '../shared/shared'

const StudentProgress = ({
  lid,
  adoptedStudentFilter,
  students,
  submissions
}) => {
  const submissionMap = (submissions || []).reduce((arr, submission) => {
    arr[`u${submission.user.id}c${submission.challenge.id}`] = {
      status: submission.status,
      mrUrl: submission.mrUrl
    }
    return arr
  }, {})

  const adoptedStudents = students || []
  return (
    <div>
      <h4>Student Progress</h4>
      <Query query={LESSON_INFO} variables={{ in: { id: lid } }}>
        {loadComponent(data => {
          const { users, challenges } = data.lessonInfo

          const usersToRender = adoptedStudentFilter ? students : users

          const LessonTrackers = usersToRender
            .filter(
              info =>
                !challenges.every(
                  challenge => !submissionMap[`u${info.id}c${challenge.id}`]
                )
            )
            .filter(info => info.id !== window.userInfo.id)
            .map((info, index) => {
              return (
                <LessonTrackerItems
                  key={index}
                  lid={lid}
                  submissions={submissionMap}
                  challenges={challenges}
                  studentId={`${info.id}`}
                  studentName={info.username}
                  adoptedStudents={adoptedStudents}
                  lessonStatus={info.userLesson}
                />
              )
            })
          return <div>{LessonTrackers}</div>
        })}
      </Query>
    </div>
  )
}

export default StudentProgress
