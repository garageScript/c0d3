import React, { Fragment } from 'react'
import { ADOPTED_STUDENT_FILTER } from '../../db/queries.js'
import { Query } from 'react-apollo'

const Toggle = () => (
  <Query query={ADOPTED_STUDENT_FILTER}>
    {({ data, client }) => {
      const filter = data.adoptedStudentFilter
      return (
        <Fragment>
          <h3>Showing {filter ? 'Adopted' : 'All'} Students</h3>
          <button
            onClick={() => {
              client.writeData({ data: { adoptedStudentFilter: !filter } })
            }}
            className='btn btn-secondary btn-sm gs-button text-capitalize'
          >
            View {filter ? 'All' : 'Adopted'} Students
          </button>
        </Fragment>
      )
    }}
  </Query>
)

export default Toggle
