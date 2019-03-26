import React from 'react'
import { Query } from 'react-apollo'
import { loadComponent } from './shared/shared'
import { SUBMISSIONS } from '../db/queries.js'

export const PendingSubmits = ({ id }) => {
  return (<Query
    query={SUBMISSIONS}
    variables={{
      in: { id },
      where: { status: 'open' }
    }}
  >
    {loadComponent(data => (
      <div> {`${data.submissions.length} pending`} </div>
    ))}
  </Query>
  )
}
