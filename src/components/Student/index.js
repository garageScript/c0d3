import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import { withRouter } from 'react-router'

import './Student.css'
import { LESSON_INFO, LESSON_STATUS } from '../../db/queries.js'
import TeacherMode from './TeacherMode'
import ChallengeList from './ChallengeList'
import CongratsModal from '../CongratsModal.js'
import { loadComponent } from '../shared/shared'

const StudentPage = ({ match }) => {
  return (
    <Query query={LESSON_INFO} variables={{ in: { id: match.params.lid } }}>
      {({ loading, error, data }) => {
        if (loading) return 'loading...'
        if (error) return 'error'
        const challenges = data.lessonInfo.challenges
          .slice()
          .sort((a, b) => a.order - b.order)
        const { docUrl, title, videoUrl } = data.lessonInfo
        return (
          <Fragment>
            <div className='gs-container-1'>
              <div className='container'>
                <CongratsModal lessonInfo={data.lessonInfo} />
                <div className='row'>
                  <h2 className='page-menu-title'>{title}</h2>
                  <nav className='breadcrumb'>
                    <TeacherMode lid={match.params.lid} />
                    <a
                      href={docUrl}
                      target='_blank'
                      className='breadcrumb-item'
                    >
                      Lesson Doc
                    </a>
                    <a
                      href={videoUrl}
                      target='_blank'
                      className='breadcrumb-item'
                    >
                      Lecture Video
                    </a>
                    <Link to='/curriculum' className='breadcrumb-item'>
                      Back to Curriculum
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
            <Query
              query={LESSON_STATUS}
              variables={{ in: { id: match.params.lid } }}
            >
              {loadComponent(({ lessonStatus }) => (
                <ChallengeList
                  challenges={challenges}
                  lessonStatus={lessonStatus || {}}
                  lessonId={match.params.lid}
                />
              ))}
            </Query>
          </Fragment>
        )
      }}
    </Query>
  )
}

const Student = withRouter(StudentPage)
export default Student
