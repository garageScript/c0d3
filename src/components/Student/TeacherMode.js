import React from 'react'
import { Link } from 'react-router-dom'
import { loadComponent } from '../shared/shared.js'
import { getLessonStatusContainer } from '../../db/queries.js'

const TeacherMode = ({ lid, lessonStatus }) => {
  if (lessonStatus && lessonStatus.isTeaching) {
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
}

export default getLessonStatusContainer(loadComponent(TeacherMode))
