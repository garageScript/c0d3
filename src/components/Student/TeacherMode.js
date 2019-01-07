import React from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'

import { LESSON_STATUS } from '../../db/queries.js'

const TeacherMode = ({ lid }) => {
  return (
    <Query query={LESSON_STATUS} variables={{ in: { id: lid } }}>
      {({ loading, error, data }) => {
        if (data.lessonStatus && data.lessonStatus.isTeaching) {
          return (
            <Link
              role='button'
              to={`/teacher/${lid}`}
              className='breadcrumb-item'
            >
              Mentor Mode
            </Link>
          )
        }
        return ''
      }}
    </Query>
  )
}

export default TeacherMode
