import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { compose } from 'react-apollo'
import '../../css/Teacher.css'
import {
  getTeacherPageContainer,
  getAdoptedStudentFilterContainer
} from '../../db/queries.js'
import SubmissionList from './SubmissionList'
import { loadComponent } from '../shared/shared'
import Toggle from './Toggle'

const TeacherPage = ({ match, lessonInfo, students, submissions, data }) => {
  const { lid } = match.params
  const adoptedStudentFilter = data.adoptedStudentFilter
  return (
    <div className='gs-content gs-body-space'>
      <div>
        <h2 className='text-center lesson-title'>
          {lessonInfo.title}
        </h2>
        <div className='page-menu'>
          <div className='btn-group page-menu-tabs' role='group'>
            <Link
              to={`/student/${lid}`}
              role='button'
              className='btn btn-rounded btn-sm btn-info'
            >
                    Student Mode
            </Link>
            <Link
              to={'/curriculum'}
              role='button'
              className='btn btn-rounded btn-sm btn-info'
            >
                    Curriculum
            </Link>
            <a
              href={lessonInfo.docUrl}
              role='button'
              target='_blank'
              rel='noopener noreferrer'
              className='btn btn-rounded btn-sm btn-info'
            >
                    Lecture Doc
            </a>
          </div>
        </div>
      </div>
      <hr />
      <div className='row justify-content-center'>
        <Toggle />
      </div>
      <div className='row'>
        <div className='col-12'>
          <SubmissionList
            lid={lid}
            adoptedStudentFilter={adoptedStudentFilter}
            students={students}
            submissions={submissions}
          />
        </div>
      </div>
    </div>
  )
}

const Teacher = withRouter(
  compose(
    getAdoptedStudentFilterContainer,
    getTeacherPageContainer
  )(loadComponent(TeacherPage))
)

export default Teacher
