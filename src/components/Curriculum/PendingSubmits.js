import React from 'react'
import { Query } from 'react-apollo'
import { loadComponent } from '../shared/shared'
import { SUBMISSIONS } from '../../db/queries.js'

export const PendingSubmits = ({ id, isPassed }) => {
  return (
    <Query
      query={SUBMISSIONS}
      variables={{
        in: { id },
        where: { status: 'open' }
      }}
    >
      {loadComponent(({ submissions }) => {
        let count = submissions.length
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
