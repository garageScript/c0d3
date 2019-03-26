import React, { Fragment } from 'react'
import { Link } from 'react-router-dom'
import { Query } from 'react-apollo'
import Markdown from 'react-markdown'
import { USER_SUBMISSIONS, CHALLENGE_INDEX } from '../../db/queries'
import { loadComponent } from '../shared/shared'
import StudentDiff from './StudentDiff'
import './ChallengeList.css'

const submissionToClassName = submission => {
  switch (submission && submission.status) {
    case 'open':
      return 'open'
    case 'underReview':
      return 'under-review'
    case 'needMoreWork':
      return 'need-more-work'
    case 'passed':
      return 'passed'
    default:
      return 'unsubmitted'
  }
}

const SubmissionMessage = ({ submission }) => {
  if (!submission) return null
  const { reviewer, status } = submission
  const className = `submission-message ${submissionToClassName(
    submission
  )}-message`
  switch (status) {
    case 'underReview':
      return (
        <div className={className}>
          Being reviewed by
          {reviewer && reviewer.username ? (
            <span className='gs-bold user-link'>
              <Link to={`/profile/${reviewer.id}`}>{reviewer.username}</Link>
            </span>
          ) : (
            ' a teacher'
          )}
        </div>
      )
    case 'needMoreWork':
      return (
        <div className={className}>
          Changes requested by
          {reviewer && reviewer.username ? (
            <span className='gs-bold user-link'>
              <Link to={`/profile/${reviewer.id}`}>{reviewer.username}</Link>
            </span>
          ) : (
            ' a teacher'
          )}
        </div>
      )
    case 'open':
      return <div className={className}>Waiting for MR to be reviewed.</div>
    case 'passed':
      return (
        <div className={className}>
          Your solution was reviewed and accepted by
          {reviewer && reviewer.username ? (
            <span className='gs-bold user-link'>
              <Link to={`/profile/${reviewer.username}`}>{reviewer.username}</Link>
            </span>
          ) : (
            ' a teacher'
          )}
        </div>
      )
    default:
      return null
  }
}

const Challenge = (challenge, submissions, questionNumber) => {
  const submission = submissions[challenge.id]
  const isAccepted = submission && submission.status === 'passed'
  return (
    <div className='col-12' key={questionNumber}>
      <div
        className={`challenge-card
        ${
    submission && submission.status ? 'submitted' : 'unsubmitted'
    }-background
        ${submissionToClassName(submission)}-border
        `}
      >
        <div className='mr-3'>
          <div
            className={`challenge-number
            ${submissionToClassName(submission)}-circle
            `}
          >
            {isAccepted ? '✓' : questionNumber}
          </div>
        </div>
        <div>
          <div className='font-weight-bold my-2'>{challenge.title}</div>
          <div className='challenge-description-markdown'>
            <Markdown source={challenge.description} />
          </div>
          {submission && submission.diff ? (
            <StudentDiff diff={submission.diff} />
          ) : null}
          <SubmissionMessage submission={submission} />
          {submission && submission.comment ? (
            <div>
              <div className='font-weight-bold'>Comments</div>
              <Markdown source={submission.comment} />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

const ChallengeListHeader = ({ challenges, submissionMap }) => {
  const allChallengesPassed = challenges.every(
    challenge =>
      submissionMap[challenge.id] &&
      submissionMap[challenge.id].status === 'passed'
  )
  return (
    <div className='col-12 text-muted'>
      <h5 className='font-weight-bold'>Challenges</h5>
      {!allChallengesPassed ? (
        <div>
          Complete all the challenges to unlock the next lesson and become a
          teacher.
        </div>
      ) : null}
    </div>
  )
}

const ChallengeList = ({ challenges, lessonId, lessonStatus }) => {
  return (
    <Query query={USER_SUBMISSIONS} variables={{ in: { lessonId } }}>
      {loadComponent(({ userSubmissions }) => {
        const finalChallenge = {
          id: 'final',
          title: 'Become a Mentor for this Lesson!',
          description: `
  Now that you've been approved for each of the challenges, it's time for you to test your understanding of the lesson by teaching it!
  Here are the steps you'll need to take in order to get approved for this challenge:

  1. Review the lesson doc you'll be using to teach (located at the top of this page).
  2. Find a mentor to schedule your teaching discernment.
  This mentor will help you do a few things: help you prepare to teach, help you schedule a day for you to teach, help you find 2 new students for you to teach, and also help observe your teaching.
  3. If your teaching flow meets our standards, that mentor will approve you for this challenge
  If not, (in other words, the mentor for some reason needed to take over the lesson because you did not prepare well enough to teach), then you will need to redo this challenge again.`
        }
        challenges[challenges.length] = finalChallenge
        const submissionMap = userSubmissions.reduce(
          (map, submission) => {
            map[submission.challenge.id] = submission
            return map
          },
          {
            final: {
              status: lessonStatus.isTeaching ? 'passed' : ''
            }
          }
        )
        return (
          <div className='container'>
            <div className='row my-4'>
              <ChallengeListHeader
                challenges={challenges}
                submissionMap={submissionMap}
              />
              <Query query={CHALLENGE_INDEX}>
                {({ client, data: { challengeIndex } }) => {
                  const currentChallenge = challenges[challengeIndex]
                  return (
                    <Fragment>
                      <ChallengeNav
                        challengeIndex={challengeIndex}
                        client={client}
                        challenges={challenges}
                        submissionMap={submissionMap}
                      />
                      {Challenge(
                        currentChallenge,
                        submissionMap,
                        challengeIndex + 1
                      )}
                    </Fragment>
                  )
                }}
              </Query>
            </div>
          </div>
        )
      })}
    </Query>
  )
}

const ChallengeNav = ({
  challenges,
  challengeIndex,
  client,
  submissionMap
}) => (
  <div className='col-12'>
    <nav>
      <ul className='pagination pg-blue justify-content-center' style={{ marginTop: '10px' }}>
        {challenges.map((challenge, i) => (
          <li
            key={`challenge-${i}`}
            className={`page-item${i === challengeIndex ? ' active' : ''}`}
          >
            <div
              className={`pagination-link ${submissionToClassName(
                submissionMap[challenge.id]
              )}-pagination`}
              onClick={() =>
                client.writeData({
                  data: { challengeIndex: i }
                })
              }
            >
              {i + 1}
            </div>
          </li>
        ))}
      </ul>
    </nav>
  </div>
)

export default ChallengeList
