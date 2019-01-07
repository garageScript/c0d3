import React from 'react'
import { Query } from 'react-apollo'

import StudentDiff from './Student/StudentDiff'
import { USER_SUBMISSIONS } from '../db/queries'
import { loadComponent } from './shared/shared'

const Diff = ({ match, submissions }) => {
  return (
    <Query
      query={USER_SUBMISSIONS}
      variables={{ in: { lessonId: match.params.lid } }}
    >
      {loadComponent(({ userSubmissions }) => {
        const submissions = userSubmissions.reduce((map, submission) => {
          map[submission.challenge.id] = submission
          return map
        }, {})
        const submission = submissions[match.params.cid] || { diff: '' }

        return (
          <div>
            <StudentDiff diff={submission.diff} />
          </div>
        )
      })}
    </Query>
  )
}

export default Diff
