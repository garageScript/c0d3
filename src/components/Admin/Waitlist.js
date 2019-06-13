import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { CREATE_A_COHORT, GET_COHORTS, GET_WAITLIST_STUDENTS, INVITE_TO_COHORT } from '../../db/queries'
import { loadComponent, cacheUpdate } from '../shared/shared.js'

const InvitedStudents = () => {
  return (
    <Query query={GET_WAITLIST_STUDENTS}>
      {loadComponent(({ getWaitListStudents }) => {
        return getWaitListStudents.map((v, i) => {
          if (v && v.cohortId) {
            return (
              <div style={{ display: 'flex', margin: '3px' }} key={i}>
                <div style={{ position: 'absolute', right: '208px', margin: '2px' }}>{v.email}</div>
                <div style={{ marginLeft: '200px' }}>ALREADY INTVITED</div>
              </div>
            )
          }
        })
      })}
    </Query>
  )
}

const UnInvitedStudents = () => {
  return (
    <Query query={GET_WAITLIST_STUDENTS}>
      {loadComponent(({ getWaitListStudents }) => {
        return getWaitListStudents.map((v, i) => {
          if (v && !v.cohortId) {
            return (
              <div style={{ display: 'flex', margin: '3px' }} key={i}>
                <div style={{ position: 'absolute', right: '208px', margin: '2px' }}>{v.email}</div>
                <Mutation update={cacheUpdate(GET_WAITLIST_STUDENTS, ({ inviteToCohort }, { getWaitListStudents }) => {
                  getWaitListStudents.forEach((e) => {
                    if (e.id === v.id) e.cohortId = '1000'
                  })
                  return { getWaitListStudents: getWaitListStudents }
                })}
                  mutation={INVITE_TO_COHORT}>
                  {(execute) => {
                    return (
                      <a style={{ marginLeft: '200px' }} onClick={() => {
                        execute({
                          variables: {
                            input: {
                              waitListId: v.id
                            }
                          }
                        })
                      }}>Invite to Cohort</a>
                    )
                  }}
                </Mutation>
              </div>
            )
          }
        }
        )
      })}
    </Query>
  )
}

const Waitlist = () => {
  return (
    <div className='container'style={{ display: 'flex' }}>
      <div className='row' style={{ textAlign: 'center' }}>
        <div className='col'>
          <Mutation
            update={cacheUpdate(GET_COHORTS, ({ createCohort }, { getCohorts }) => {
              return { getCohorts: getCohorts.concat(createCohort) }
            })}
            mutation={CREATE_A_COHORT}>
            {(execute) => {
              return (
                <button className='btn btn-info btn-rounded' type='button' style={{ position: 'fixed', left: '-10px', top: '20%', width: '11%' }} onClick={() => { execute({}) }}>CREATE A NEW COHORT</button>
              )
            }}
          </Mutation>
        </div>
        <div className='col' style={{ textAlign: 'center' }}>
          <h1>Cohorts</h1>
          <Query query={GET_COHORTS}>
            { loadComponent(({ getCohorts }) => {
              return getCohorts.map((v, i) => {
                return (
                  <div style={{ textAlign: 'center', margin: '3px' }} key={i}>
                    <div>Cohort {v.id}</div>
                  </div>
                )
              })
            }) }
            })}
          </Query>
        </div>
      </div>
      <div className='col'>
        <h1 style={{ textAlign: 'center' }}>Waitlist</h1>
        <InvitedStudents />
        <UnInvitedStudents />
        <h1 style={{ textAlign: 'center' }} >Waitlist</h1>
        <Query query={GET_WAITLIST_STUDENTS}>
          {loadComponent(({ getWaitListStudents }) => {
            return getWaitListStudents.map((v, i) => {
              return (
                <div style={{ display: 'flex', margin: '3px' }} key={i}>
                  <div style={{ position: 'absolute', right: '208px', margin: '2px' }}>{v.email}</div>
                  <Mutation mutation={INVITE_TO_COHORT}>
                    {(execute) => {
                      return (
                        <a style={{ marginLeft: '200px' }} onClick={() => {
                          execute({
                            variables: {
                              input: {
                                waitListId: v.id
                              }
                            }
                          })
                        }}>Invite to Cohort</a>
                      )
                    }}
                  </Mutation>
                </div>
              )
            })
          })}
        </Query>
      </div>
    </div>
  )
}

export default Waitlist
