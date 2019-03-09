import React from 'react'
import { Query } from 'react-apollo'

import '../css/LessonList.css'
import { CURRICULUM_STATUS } from '../db/queries.js'
import { loadComponent } from './shared/shared'
import { FirstLesson, LessonCard } from './Curriculum/LessonCard'

const LessonListPage = () => (
  <Query query={CURRICULUM_STATUS}>
    {loadComponent(({ curriculumStatus: lessons }) => {
      const allLessons = [...lessons].sort((a, b) => a.order - b.order)
      const firstLesson = allLessons.find((lesson) => {
        const loggedInUser = lesson.currentUser
        return !loggedInUser || !loggedInUser.userLesson || !loggedInUser.userLesson.isPassed
      })
      return (
        <div>
          <div className='gs-container-1'>
            <div className='gs-body-space'>
              <h2 className='gs-curriculum-header'>
                Welcome back, {window.userInfo.name}
              </h2>
              <FirstLesson lesson={firstLesson} />
            </div>
          </div>
          <div className='gs-container-2'>
            <div className='gs-body-space'>
              <h2>Curriculum</h2>
              <p className='text-justify'>
                A peer-to-peer, project-based curriculum designed to help people
                of any background become great engineers.<br />
                Please select a lesson below to enroll.
              </p>
              <div className='gs-lessonlist-container'>
                {allLessons.map(lesson => (
                  <LessonCard
                    key={lesson.id}
                    lesson={lesson}
                    cardType='small'
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )
    })}
  </Query>
)

export default LessonListPage
