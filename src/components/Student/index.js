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
            <Query
              query={LESSON_STATUS}
              variables={{ in: { id: match.params.lid } }}
            >
              {loadComponent((data) => {
                const lessonStatus = data.lessonStatus || {}
                if (!lessonStatus.starGiven) return ''
                return (
                  <div className='card' style={{ position: 'fixed', top: 70, right: 10, width: '11%' }}>
                    <div className='card-body text-center'>
                      <i className='fa fa-star fas' style={{ color: 'yellow', WebkitTextStrokeWidth: '3px', WebkitTextStrokeColor: ' black', fontSize: 30 }} />
                      <h4 className='font-weight-bold indigo-text py-2' style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <Link to={`/profile/${lessonStatus.starGiven.username}`}> {lessonStatus.starGiven.username}  </Link>
                      </h4>
                      <p className='card-text'>{lessonStatus.starComment} </p>
                    </div>
                  </div>
                )
              })}
            </Query>

            <div className='gs-container-1'>
              <div className='container'>
                <CongratsModal lessonInfo={data.lessonInfo} />
                <div className='row' style={{ marginTop: '10px' }} >
                  <h2 className='page-menu-title'>{title}</h2>
                  <nav className='breadcrumb'>
                    <TeacherMode lid={match.params.lid} />
                    <a
                      href={docUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='breadcrumb-item'
                    >
                      Lesson Doc
                    </a>
                    <a
                      href={videoUrl}
                      target='_blank'
                      rel='noopener noreferrer'
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
            <a type='button' className='btn btn-info' href={data.lessonInfo.chatUrl} style={{ position: 'fixed', right: 0, bottom: 0 }}>Need Help?</a>
          </Fragment>
        )
      }}
    </Query>
  )
}

const Student = withRouter(StudentPage)
export default Student
