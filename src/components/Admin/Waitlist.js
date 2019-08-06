import React from 'react'
import { getWaitListContainer } from '../../db/queries'
import { loadComponent } from '../shared/shared.js'

const Waitlist = ( { data } ) => {
  const {
    getWaitListStudents, getLastCohort, createCohort, inviteCohort
  } = data
  const unInvitedStudents = getWaitListStudents.filter( el => !el.cohortId )
  const isEmpty = unInvitedStudents.length === 0
  const lastCohort = Number(getLastCohort.id)
  const inviteToCohort = ( id ) => () => inviteCohort( {
    variables: { input: { waitListId: id } }
  } )
  const rows = unInvitedStudents.map( ( el, index ) => (
    <tr key={ el.id }>
      <th className='text-center align-middle' scope="row">{ ++index }</th>
      <td className='text-center align-middle'>{ el.email }</td>
      <td className='text-right align-middle'>
        <button
          className='btn btn-sm btn-outline-primary waves-effect'
          onClick={ inviteToCohort( el.id ) }>
          Invite to Cohort
        </button>
      </td>
    </tr>
  ) )
  const table = (
    <table className="table table-striped table-sm">
      <thead>
        <tr>
          <th className='text-center' scope="col">#</th>
          <th className='text-center' scope="col">E-mail</th>
        </tr>
      </thead>
      <tbody>
        { rows }
      </tbody>
    </table>
  )
  const infoMessage = (
    <div className="alert alert-primary" role="alert">
      No students uninvited on the wait list!
  </div>
  )

  return (
    <div className='container'>
      <button
        className='btn btn-info'
        type='button'
        onClick={ createCohort }
      >
        Create Cohort { lastCohort + 1 }
      </button>
      <h1 className='text-center'>Cohort { lastCohort }</h1>
      { isEmpty ? infoMessage : table }
    </div>
  )
}

export default getWaitListContainer( loadComponent( Waitlist ) )
