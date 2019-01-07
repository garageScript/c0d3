import React from 'react'
import { Query } from 'react-apollo'
import { Link } from 'react-router-dom'

import { loadComponent } from './shared/shared'
import { SUBMISSIONS } from '../db/queries.js'

const ChallengeBar = ({ lid, studentId, challenges }) => {
  return (
    <Query query={SUBMISSIONS} variables={{ in: { id: lid } }}>
      {loadComponent(({ submissions }) => {
        const submissionMap = (submissions || []).reduce((arr, submission) => {
          arr[`u${submission.user.id}c${submission.challenge.id}`] = {
            status: submission.status,
            mrUrl: submission.mrUrl
          }
          return arr
        }, {})

        const challengesCopy = [...challenges]
        const challengeBar = user =>
          challengesCopy
            .sort((a, b) => a.order - b.order)
            .map((challengeInfo, index) => {
              const mapId = `u${user}c${challengeInfo.id}`
              const submission = submissionMap[mapId] || {}
              let statusColor
              switch (submission.status) {
                case 'passed':
                  statusColor = 'btn btn-sm bg-success'
                  break
                case 'open':
                  statusColor = 'btn btn-sm btn-warning'
                  break
                case 'needMoreWork':
                  statusColor = 'btn btn-sm btn-danger'
                  break
                default:
                  statusColor = 'btn btn-sm bg-dark'
              }
              return (
                <Link
                  target='_blank'
                  rel='noopener noreferrer'
                  key={index}
                  href={submission.mrUrl}
                  className={statusColor}
                  style={{ paddingLeft: '15px' }}
                  to={`/submissions/${lid}/${challengeInfo.id}`}
                >
                  #{index + 1}
                </Link>
              )
            })

        return (
          <div
            className='btn-toolbar'
            role='toolbar'
            aria-label='tracker bar within button groups'
          >
            <div
              className='btn-group mr-2'
              role='group'
              aria-label='tracker button group'
            >
              <div>{challengeBar(studentId)}</div>
            </div>
          </div>
        )
      })}
    </Query>
  )
}

export default ChallengeBar
