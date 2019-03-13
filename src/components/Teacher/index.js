import React from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { Query } from 'react-apollo'

import '../../css/Teacher.css'
import {
  SUBMISSIONS,
  STUDENTS,
  LESSON_INFO,
  ADOPTED_STUDENT_FILTER
} from '../../db/queries.js'
import SubmissionList from './SubmissionList'
import { loadComponent } from '../shared/shared'
import Toggle from './Toggle'

const TeacherPage = ({ match }) => {
  const { lid } = match.params
  return (
    <div className='gs-content gs-body-space'>
      <Query query={LESSON_INFO} variables={{ in: { id: match.params.lid } }}>
        {loadComponent(data => {
          return (
            <div>
              <h2 className='text-center lesson-title'>
                {data.lessonInfo.title}
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
                  <Link
                    to={`${data.lessonInfo.docUrl}`}
                    role='button'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='btn btn-rounded btn-sm btn-info'
                  >
                    Lecture Doc
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </Query>
      <hr />
      <div className='row justify-content-center'>
        <Toggle />
      </div>
      <Query query={STUDENTS} variables={{ in: { id: lid } }}>
        {loadComponent(({ students }) => {
          return (
            <Query query={SUBMISSIONS} variables={{ in: { id: lid } }}>
              {loadComponent(({ submissions }) => {
                return (
                  <Query query={ADOPTED_STUDENT_FILTER}>
                    {loadComponent(({ adoptedStudentFilter }) => {
                      return (
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
                      )
                    })}
                  </Query>
                )
              })}
            </Query>
          )
        })}
      </Query>
    </div>
  )
}

const Teacher = withRouter(TeacherPage)

export default Teacher
