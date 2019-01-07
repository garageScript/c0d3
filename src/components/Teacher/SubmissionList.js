import React from 'react'
import MergeRequest from './MergeRequest'
import FilterControl from './FilterControl'

const SubmissionList = ({
  lid,
  mrFilter,
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
    ? (submissions || []).filter(mrInfo => studentMap[mrInfo.user.id])
    : submissions || []

  submissionsToShow = submissionsToShow.filter(
    mrInfo =>
      mrInfo.status === mrFilter && mrInfo.user.id !== window.userInfo.id
  )
  const MergeRequestList = submissionsToShow.map((mrInfo, index) => {
    return <MergeRequest key={index} lid={lid} mrInfo={mrInfo} />
  })

  return (
    <div>
      <h4>Submissions</h4>
      <FilterControl />
      {MergeRequestList}
    </div>
  )
}

export default SubmissionList
