const gitLabMR = {
  retrieveMR: (username, created_before, created_after, callback) => {
    const getMergeRequest = new XMLHttpRequest()
    getMergeRequest.open(
      'post',
      `${process.env.REACT_APP_GSDB_URL}/profile/merge_requests`
    )
    getMergeRequest.setRequestHeader('content-type', 'application/json')
    getMergeRequest.onloadend = () => {
      if (getMergeRequest.responseText) {
        callback(JSON.parse(getMergeRequest.responseText))
      }
    }
    getMergeRequest.send(
      JSON.stringify({ username, created_after, created_before })
    )
  }
}

export default gitLabMR
