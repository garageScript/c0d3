import React from 'react'
import MergeRequest from './MergeRequest'

const SubmissionList = ({
  lid,
  adoptedStudentFilter,
  students,
  submissions
}) => {
  const studentMap = {}
  const adoptedStudents = students || []
  adoptedStudents.forEach(student => {
    studentMap[student.id] = student
  })

  let submissionsToShow = adoptedStudentFilter
    ? (submissions || []).filter(mrInfo => mrInfo.user && studentMap[mrInfo.user.id])
    : submissions || []

  submissionsToShow = submissionsToShow.filter(
    mrInfo =>
      mrInfo.status.includes('open') && mrInfo.user.id !== window.userInfo.id
  )
  const MergeRequestList = submissionsToShow.map((mrInfo, index) => {
    return <MergeRequest key={index} lid={lid} mrInfo={mrInfo} studentMap={studentMap} />
  })

  return (
    <div>
      {MergeRequestList}
    </div>
  )
}

export default SubmissionList
