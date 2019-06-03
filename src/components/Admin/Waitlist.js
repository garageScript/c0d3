import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { INVITE_TO_COHORT, CREATE_A_COHORT, GET_COHORTS, GET_WAITLIST_STUDENTS } from '../../db/queries'
import { loadComponent, cacheUpdate } from '../shared/shared.js'

const Waitlist = () => {
  return (
    <div className='container'style={{ display: 'flex' }}>
      <div className='row' style={{ textAlign: 'center' }}>
        <div className='col'>
          <h1>New Cohorts</h1>
          <Mutation
            update={cacheUpdate(GET_COHORTS, ({ createCohort }, { getCohorts }) => {
              return { getCohorts: getCohorts.concat(createCohort) }
            })
            }
            mutation={CREATE_A_COHORT}>
            {(execute) => {
              return (
                <button onClick={() => {
                  execute({})
                }}>CREATE</button>
              )
            }}
          </Mutation>
        </div>
        <div className='col' style={{ textAlign: 'center' }}>
          <h3>Previous Cohorts:</h3>
          <Query query={GET_COHORTS}>
            { loadComponent(({ getCohorts }) => {
              return getCohorts.map((v, i) => {
                return (
                  <div style={{ textAlign: 'center' }} key={i}>
                    <div>Cohort {i + 1}: </div>
                    <hr />
                  </div>
                )
              })
            })
            }
          </Query>
        </div>
      </div>
      <div className='col-6' style={{ textAlign: 'center' }}>
        <h3>Waitlist:</h3>
        <Query query={GET_WAITLIST_STUDENTS}>
          {loadComponent(({ getWaitListStudents }) => {
            return getWaitListStudents.map((v, i) => {
              return (
                <div key={i}>
                  <div style={{ display: 'flex' }}>
                  Student
                    <hr />
                    <div>{v.id}</div>
                    <hr />
                    <div>{v.email}</div>
                    <hr />
                    <button>ADD TO COHORT</button>
                  </div>
                  <hr />
                </div>
              )
            })
          })}
        </Query>
        <div style={{ display: 'block' }}>
          <Mutation mutation={INVITE_TO_COHORT}>
            {(execute) => {
              return (
                <div>
                  <button onClick={() => {
                    execute({
                      variables: {
                        input: 'rkalra247@gmail.com'
                      }
                    })
                  }}>JOIN</button>
                </div>
              )
            }}
          </Mutation>
        </div>
      </div>
    </div>
  )
}

export default Waitlist
