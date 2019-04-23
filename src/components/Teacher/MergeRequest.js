import React from 'react'
import { Link } from 'react-router-dom'
import { Mutation } from 'react-apollo'
import moment from 'moment'
import Markdown from 'react-markdown'
import { cacheUpdate } from '../shared/shared'
import MarkdownComponent from '../shared/Markdown.js'
import User from '../shared/User.js'

import {
  APPROVE_SUBMISSION,
  REJECT_SUBMISSION,
  SUBMISSIONS,
  UNAPPROVE_SUBMISSION,
  ADOPT_STUDENT,
  UNADOPT_STUDENT,
  STUDENTS
} from '../../db/queries'
import StudentDiff from '../Student/StudentDiff'

const updateSubmissions = (submissions, status, { id }) => {
  submissions.forEach(sub => {
    if (sub.id === id) sub.status = status
  })
  return submissions
}

const MergeRequestBody = ({ mrInfo, lid }) => {
  let submissionVar = {
    in: {
      challengeId: `${mrInfo.challenge.id}`,
      lessonId: `${lid}`,
      userId: `${mrInfo.user.id}`
    }
  }
  if (mrInfo.status.includes('-')) {
    const status = mrInfo.status.split('-')[1]
    return (
      <div>
        <p className='card-text'>You have {status} this submission</p>
        <Mutation mutation={UNAPPROVE_SUBMISSION}
          variables={submissionVar}
          update={cacheUpdate(SUBMISSIONS, ({ unapproveSubmission }, { submissions }) => {
            return updateSubmissions(submissions, 'open', unapproveSubmission)
          }, { in: { id: lid } })}
        >
          {(execute) => {
            return (
              <button className='btn btn-outline-danger waves-effect btn-sm' onClick={() => {
                execute()
              }}>UNDO</button>
            )
          }}
        </Mutation>
      </div>
    )
  }
  let comment
  const formattedCreatedAt = moment(+mrInfo.createdAt).format('MMM Do h:mma')
  const formattedUpdatedAt = moment(+mrInfo.updatedAt).fromNow()
  return (
    <div className='card-text'>
      <h6 className='mt-2'>
        {` on ${formattedCreatedAt} | updated ${formattedUpdatedAt} `}
      </h6>
      <StudentDiff diff={mrInfo.diff} />
      <hr />
      {mrInfo.comment ? (
        <div>
          <h6>Comments</h6>
          <Markdown source={mrInfo.comment} />
          <hr />
        </div>
      ) : null}

      <label htmlFor='submission-comment'>
                  Add your comments to address here
      </label>
      <div style={{ width: '100%', height: '300px' }}>
        <MarkdownComponent setRef={node => {
          comment = node
        }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <Mutation
          mutation={APPROVE_SUBMISSION}
          update={cacheUpdate(SUBMISSIONS, ({ approveSubmission }, { submissions }) => {
            return updateSubmissions(submissions, 'open-approved', approveSubmission)
          }, { in: { id: lid } })}
        >
          {execute => (
            <button className='btn btn-sm btn-success' onClick={() => {
              submissionVar.in.comment = comment.value
              execute({ variables: submissionVar })
            }}>
              <i className='fa fa-thumbs-up mr-2' />
                        Approve Challenge
            </button>
          )}
        </Mutation>
        <Mutation mutation={REJECT_SUBMISSION}
          update={cacheUpdate(SUBMISSIONS, ({ rejectSubmission }, { submissions }) => {
            return updateSubmissions(submissions, 'open-rejected', rejectSubmission)
          }, { in: { id: lid } })}
        >
          {execute => (
            <button
              className='btn btn-sm btn-dark'
              onClick={() => {
                submissionVar.in.comment = comment.value
                execute({ variables: submissionVar })
              }}
            >
              <i className='fa fa-comment mr-2' />
                            Suggest Revision
            </button>
          )}
        </Mutation>
      </div>
    </div>
  )
}

const MergeRequest = ({ lid, mrInfo, studentMap }) => {
  const isAdopted = studentMap[mrInfo.user.id]
  let [adoptButton, buttonTitle, mutationQuery] = [ 'btn-outline-warning waves-effect', 'ADOPT ME', ADOPT_STUDENT]
  if (isAdopted) {
    [adoptButton, buttonTitle, mutationQuery] = [ 'btn-warning', 'ADOPTED', UNADOPT_STUDENT]
  }
  const mutationVar = { input: { lessonId: lid, userId: mrInfo.user.id } }
  return (
    <div className='card-deck'>
      <div className='card mb-2 mt-1'>
        <div className='card-body'>
          <div className='card-title'>
            <span className='h5'>
              <Mutation mutation={mutationQuery} variables={mutationVar} update={cacheUpdate(STUDENTS, (_, { students }) => {
                if (isAdopted) {
                  return {
                    students: students.filter((s) => mrInfo.user.id !== s.id)
                  }
                }
                students.push({ ...mrInfo.user, userLesson: null })
                return { students }
              }, { in: { id: lid } })} >
                {(execute) => {
                  console.log(mrInfo.user.id)
                  return (
                    <button className={`btn ${adoptButton}`} onClick={execute} style={{
                      position: 'absolute',
                      right: '15px'
                    }}>{ buttonTitle}</button>
                  )
                }}
              </Mutation>
              <Link to={`/profile/${mrInfo.user.id}`}>
                <User userId={mrInfo.user.id} />
              </Link>{' '}
              submitted challenge: {mrInfo.challenge.title}
            </span>
          </div>
          <MergeRequestBody mrInfo={mrInfo} lid={lid} />
        </div>
      </div>
    </div>
  )
}

export default MergeRequest
