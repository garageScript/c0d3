import React, { Fragment } from 'react'
import { ADOPTED_STUDENT_FILTER } from '../../db/queries.js'
import { Query } from 'react-apollo'

const Toggle = () => (
  <Query query={ADOPTED_STUDENT_FILTER}>
    {({ data, client }) => {
      const filter = data.adoptedStudentFilter
      return (
        <Fragment>
          <ul style={{ width: '100%' }} className='nav md-pills nav-justified pills-pink'>
            <li className='nav-item'>
              <a className='nav-link active' data-toggle='tab' href='#panel56' role='tab' onClick={() => {
                client.writeData({ data: { adoptedStudentFilter: false } })
              }} >View All Students</a>
            </li>
            <li className='nav-item'>
              <a
                onClick={() => {
                  client.writeData({ data: { adoptedStudentFilter: true } })
                }}
                className='nav-link' data-toggle='tab' href='#panel55' role='tab'
              >
                View Adopted Students
              </a>
            </li>
          </ul>
        </Fragment>
      )
    }}
  </Query>
)

export default Toggle
