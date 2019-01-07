import React from 'react'
import { Mutation } from 'react-apollo'
import { MAKE_TEACHER, UN_MAKE_TEACHER } from '../../db/queries'

const TeacherToggle = ({ isTeaching, lid, studentId }) => {
  const makeTeacher = (
    <Mutation mutation={MAKE_TEACHER}>
      {execute => (
        <button
          type='button'
          className='btn btn-blue-grey btn-sm'
          onClick={() => {
            execute({
              variables: {
                in: {
                  id: lid,
                  userId: studentId
                }
              }
            })
          }}
        >
          Make Teacher
        </button>
      )}
    </Mutation>
  )

  const unMakeTeacher = (
    <Mutation mutation={UN_MAKE_TEACHER}>
      {execute => (
        <button
          type='button'
          className='btn btn-amber btn-sm'
          onClick={() => {
            execute({
              variables: {
                in: {
                  id: lid,
                  userId: studentId
                }
              }
            })
          }}
        >
          Un-make Teacher
        </button>
      )}
    </Mutation>
  )

  const btnToDisplay = !isTeaching ? makeTeacher : unMakeTeacher

  return btnToDisplay
}

export default TeacherToggle
