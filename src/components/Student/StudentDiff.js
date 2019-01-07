import React, { Fragment } from 'react'
import { parseDiff, Diff, Hunk } from 'react-diff-view'

import './StudentDiff.css'
import './Change.css'
import './Widget.css'
import './File.css'
import './Hunk.css'
import './Diff.css'

const renderHunk = hunk => {
  // Only render in the code section
  // Add this header var in the prop header to create a custom header
  // const header = [null, `${hunk.changes} changes below`];
  return <Hunk key={hunk.content} hunk={hunk} />
}

const StudentDiff = ({ diff }) => {
  const files = diff ? parseDiff(diff) : []
  return (
    <div className='my-3'>
      {files.map(({ hunks, oldPath, newPath, type }, i) => (
        <Fragment key={`file-${i}`}>
          <header className='diff-header-file'>
            <strong className='filename'>
              {type === 'delete' ? oldPath : newPath}
            </strong>
          </header>
          <Diff key={i} viewType='unified'>
            {hunks.map(renderHunk)}
          </Diff>
        </Fragment>
      ))}
    </div>
  )
}

export default StudentDiff
