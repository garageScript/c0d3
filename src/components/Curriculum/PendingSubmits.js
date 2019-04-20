import React from 'react'
import { Query } from 'react-apollo'
import { loadComponent } from '../shared/shared'
import { SUBMISSIONS } from '../../db/queries.js'

export const PendingSubmits = ({ id, isPassed }) => {
  return (
    <Query
      query={SUBMISSIONS}
      variables={{
        in: { id }
      }}
    >
      {loadComponent(({ submissions }) => {
        let subs = submissions.filter((s) => s.status.includes('open'))
        let message = 'review'
        if (!isPassed) {
          message = 'submissions'
          subs = subs.filter((s) => +s.user.id === +window.userInfo.id)
        }
        return (
          <div> {`${subs.length} pending ${message}`} </div>
        )
      })}
    </Query>
  )
}
