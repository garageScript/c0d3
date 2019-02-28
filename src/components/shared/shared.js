import React from 'react'
export const loadComponent = fn => {
  return ({ loading, error, data, client, refetch }) => {
    if (loading) return <i className='fa fa-spinner fa-spin' />
    if (error) return 'error'
    return fn(data, client, refetch)
  }
}
