import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { CREATE_A_COHORT, GET_COHORTS, GET_WAITLIST_STUDENTS } from '../../db/queries'
import { loadComponent, cacheUpdate } from '../shared/shared.js'

const Waitlist = () => {
  return (
    <div className='container'style={{ display: 'flex' }}>
      <div className='row' style={{ textAlign: 'center' }}>
        <div className='col'>
          <Mutation
            update={cacheUpdate(GET_COHORTS, ({ createCohort }, { getCohorts }) => {
              return { getCohorts: getCohorts.concat(createCohort) }
            })
            }
            mutation={CREATE_A_COHORT}>
            {(execute) => {
              return (
                <button className='btn btn-info btn-rounded' type='button' style={{ position: 'fixed', right: '10%', top: '50%', width: '30%' }} onClick={() => {
                  execute({})
                }}>CREATE A NEW COHORT</button>
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
                  <div style={{ textAlign: 'center' }} key={i}>
                    <div className='card-body card-title font-weight-bold'>Cohort {i + 1}</div>
                  </div>
                )
              })
            })
            }
          </Query>
        </div>
      </div>
      <div className='col-md-6 mb-4' style={{ textAlign: 'center' }}>
        <h1>Waitlist</h1>
        <Query query={GET_WAITLIST_STUDENTS}>
          {loadComponent(({ getWaitListStudents }) => {
            return getWaitListStudents.map((v, i) => {
              return (
                <div key={i}>
                  <button type='button' className='btn btn-outline-success btn-rounded waves-effect'>ADD {v.email} TO A COHORT</button>
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
