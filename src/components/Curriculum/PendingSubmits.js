import React from 'react'
import { loadComponent } from '../shared/shared'
import { submissionsContainer } from '../../db/queries.js'

const PendingSubmits = ( { submissions, isPassed } ) => {
  const message = isPassed ? 'review' : 'submissions'
  let subs = submissions.filter( s => s.status.includes( 'open' ) )
  if ( !isPassed ) subs = subs.filter( s => +s.user.id === +window.userInfo.id )

  return <p>{ subs.length } pending { message }</p>
}

export default submissionsContainer( loadComponent( PendingSubmits ) )