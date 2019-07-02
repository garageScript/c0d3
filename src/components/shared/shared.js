import React from 'react'
export const loadComponent = fn => {
  return ({ loading, error, data, client, refetch }) => {
    // TODO: after the migration to use graphql instead of Query components,
    //   remove loading, error, client, refetch because everything will be
    //   contained inside data
    if (loading || data.loading) return <i className='fa fa-spinner fa-spin' />
    if (error || data.error) return 'error'
    return fn(data, client, refetch)
  }
}
export const cacheUpdate = (query, cb, variables) => {
  return (cache, { data }) => {
    const cacheData = cache.readQuery({
      query,
      variables
    })
    cache.writeQuery({
      query,
      variables,
      data: cb(data, cacheData)
    })
  }
}
