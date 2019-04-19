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
        let count = submissions.filter((sub) => sub.status.includes('open')).length
        let message = 'review'
        if (!isPassed) {
          message = 'submissions'
          count = submissions.filter((s) => {
            return +s.user.id === +window.userInfo.id
          }).length
        }
        return (
          <div> {`${count} pending ${message}`} </div>
        )
      })}
    </Query>
  )
}
