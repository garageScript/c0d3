import React from 'react'
import { Query } from 'react-apollo'
import { ADOPTED_STUDENT_FILTER } from '../../db/queries.js'

const FilterControl = () => {
  return (
    <Query query={ADOPTED_STUDENT_FILTER}>
      {({ data, client }) => {
        return (
          <div>
            <button
              onClick={() => {
                client.writeData({ data: { mrFilter: 'open' } })
              }}
              className={`btn ${
                data.mrFilter === 'open'
                  ? 'btn-secondary'
                  : 'btn-outline-secondary'
              } btn-sm gs-button text-capitalize`}
            >
              open
            </button>
            <button
              onClick={() => {
                client.writeData({ data: { mrFilter: 'needMoreWork' } })
              }}
              className={`btn ${
                data.mrFilter === 'needMoreWork'
                  ? 'btn-secondary'
                  : 'btn-outline-secondary'
              } btn-sm gs-button text-capitalize`}
            >
              needMoreWork
            </button>
            <button
              onClick={() => {
                client.writeData({ data: { mrFilter: 'passed' } })
              }}
              className={`btn ${
                data.mrFilter === 'passed'
                  ? 'btn-secondary'
                  : 'btn-outline-secondary'
              } btn-sm gs-button text-capitalize`}
            >
              passed
            </button>
          </div>
        )
      }}
    </Query>
  )
}

export default FilterControl
