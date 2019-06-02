import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { INVITE_TO_COHORT, CREATE_A_COHORT, GET_COHORTS } from '../../db/queries'
import { loadComponent } from '../shared/shared.js'

const Waitlist = () => {
  return (
    <div style={{ display: 'flex' }}>
      <div className='cohortInput'>
        <h1>New Cohorts</h1>
        <Mutation mutation={CREATE_A_COHORT}>
          {(execute) => {
            return (
              <button onClick={() => {
                execute({})
              }}>CREATE</button>
            )
          }}
        </Mutation>
        <hr />
        <h1>Previous Cohorts:</h1>
        <Query query={GET_COHORTS}>
          { loadComponent(({ getCohorts }) => {
            return getCohorts.map((v, i) => {
              return (
                <div style={{ textAlign: 'center' }}>
                  <div>Cohort {i + 1}: </div>
                  <hr />
                </div>
              )
            })
          })
          }
        </Query>
      </div>
      <div className='waitlist' style={{ padding: '30px' }}>
        <h2 style={{ padding: '20px' }}>Waitlist:</h2>
        <div style={{ display: 'block' }}>
          <Mutation mutation={INVITE_TO_COHORT}>
            {(execute) => {
              return (
                <div>
                Rahul <button onClick={() => {
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
