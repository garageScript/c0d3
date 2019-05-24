import React from 'react'
import { Mutation } from 'react-apollo'
import { INVITE_TO_COHORT, CREATE_A_COHORT } from '../../db/queries'

class Waitlist extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cohortId: ''
    }
  }
  render () {
    return (
      <div style={{ display: 'flex' }}>
        <div className='cohortInput'>
          <h1>New Cohorts</h1>
            Cohort Number: <input onChange={(value) => {
            this.setState({
              cohortId: value.target.value
            })
          }} />
          <Mutation mutation={CREATE_A_COHORT}>
            {(execute) => {
              return (
                <button onClick={() => {
                  execute({
                    variables: {
                      input: this.state.cohortId
                    }
                  })
                  this.setState({
                    cohortId: ''
                  })
                }}>CREATE</button>
              )
            }}
          </Mutation>
          <hr />
          <h1>Previous Cohorts:</h1>
          <div className='listOfAllCohorts'>
        Cohort 1 <button style={{ margin: '10px', display: 'block' }}>EDIT</button>
        Cohort 2 <button style={{ margin: '10px', display: 'block' }}>EDIT</button>
        Cohort 3 <button style={{ margin: '10px', display: 'block' }}>EDIT</button>
            <hr />
          </div>
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
}

export default Waitlist
