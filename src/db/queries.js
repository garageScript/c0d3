import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

export const LESSON_STATUS = gql`
  query lessonStatus($in: LessonId) {
    lessonStatus(input: $in) {
      userId
      lessonId
      isPassed
      isTeaching
      isEnrolled
      starGiven {
        id
        username
      }
      starComment
    }
  }
`

export const USERS = gql`
  query users($in: UserInput) {
    users(input: $in) {
      username
      name
      email
      id
      isAdmin
    }
  }
`

export const GIVE_STAR = gql`
  mutation giveStar($in: LessonUserId) {
    giveStar(input: $in)
  }
`

const lessonInfo = `
  lessonInfo(input: $in) {
    id
    description
    docUrl
    githubUrl
    videoUrl
    order
    title
    chatUrl
    challenges {
      id
      description
      order
      title
    }
    users {
      id
      username
      userLesson {
        isPassed
        isTeaching
        isEnrolled
      }
    }
  }
`
export const LESSON_INFO = gql`
  query lessonInfo($in: LessonId) {
    ${lessonInfo}
  }
`

export const TEACHERS = gql`
  query teachers($in: LessonId) {
    teachers(input: $in) {
      id
      username
    }
  }
`

export const STAR_RECIPIENT = gql`
  query StartRecipient {
    starRecipent @client
  }
`
export const STUDENT_CHALLENGE_DATA = gql`
  {
    mrUrl @client
  }
`

export const CHALLENGE_INDEX = gql`
  {
    challengeIndex @client
  }
`

export const ADOPTED_STUDENT_FILTER = gql`
  {
    adoptedStudentFilter @client
  }
`

const students = `
  students(input: $in) {
    id
    username
    userLesson {
      isPassed
      isTeaching
      isEnrolled
    }
  }
`

export const STUDENTS = gql`
  query student($in: LessonId) {
    ${students}
  }
`

export const CHALLENGE_STATUS = gql`
  query challengeStatus($in: ChallengeId) {
    challengeStatus(input: $in) {
      status
      mrUrl
      viewCount
      userId
      lessonId
      challengeId
      diff
      comment
      reviewer {
        id
        username
      }
      user {
        id
      }
      reviewerId
    }
  }
`

export const LESSONS = gql`
  query receivedStars($in: UserType)
  {
    lessons (input: $in){
      id
      description
      docUrl
      githubUrl
      videoUrl
      title
      order
      chatUrl
      challenges {
        id
        description
        title
        order
      }
      users {
        id
        username
      }
    }
  }
`

export const RECEIVED_STARS = gql`
  query receivedStars($in: UserInput) {
    receivedStars(input: $in) {
      lessonId
      student {
        username
      }
    }
  }
`

export const CURRICULUM_STATUS = gql`
  {
    curriculumStatus {
      id
      description
      title
      order
      currentUser {
        userLesson {
          isEnrolled
          isTeaching
          isPassed
        }
      }
    }
  }
`
const submissions = `
  submissions(input: $in) {
    id
    status
    mrUrl
    diff
    comment
    viewCount
    user {
      username
      id
     }
     challenge {
      title
      id
     }
     createdAt
     updatedAt
   }
`

export const SUBMISSIONS = gql`
  query submissions($in: LessonId) {
    ${submissions}
  }
`

export const USER_SUBMISSIONS = gql`
  query userSubmissions($in: LessonUserId) {
    userSubmissions(input: $in) {
      status
      mrUrl
      diff
      viewCount
      comment
      reviewer {
        username
        id
      }
      challenge {
        title
        id
      }
    }
  }
`

export const APPROVE_SUBMISSION = gql`
  mutation approveSubmission($in: SubmissionEdit) {
    approveSubmission(input: $in) {
      id
    }
  }
`

export const MAKE_TEACHER = gql`
  mutation makeTeacher($in: LessonId) {
    makeTeacher(input: $in)
  }
`

export const UN_MAKE_TEACHER = gql`
  mutation unMakeTeacher($in: LessonId) {
    unMakeTeacher(input: $in)
  }
`

export const UNAPPROVE_SUBMISSION = gql`
  mutation unapproveSubmission($in: SubmissionEdit) {
    unapproveSubmission(input: $in) {
      id
    }
  }
`

export const REJECT_SUBMISSION = gql`
  mutation rejectSubmission($in: SubmissionEdit) {
    rejectSubmission(input: $in) {
      id
    }
  }
`

export const CREATE_SUBMISSION = gql`
  mutation createSubmission($in: SubmissionInput) {
    createSubmission(input: $in) {
      id
    }
  }
`

export const ADOPT_STUDENT = gql`
  mutation adoptStudent($input: LessonUserId) {
    adoptStudent(input: $input)
  }
`

export const UNADOPT_STUDENT = gql`
  mutation unAdoptStudent($input: LessonUserId) {
    unAdoptStudent(input: $input)
  }
`

export const SAVE_LESSON = gql`
  mutation saveLesson($input: LessonInput) {
    saveLesson(input: $input) {
      id
      description
      docUrl
      githubUrl
      videoUrl
      order
      title
      chatUrl
    }
  }
`

export const CREATE_LESSON = gql`
  mutation createLesson($input: LessonInput) {
    createLesson(input: $input) {
      id
      description
      docUrl
      githubUrl
      videoUrl
      order
      title
      chatUrl
    }
  }
`

export const SAVE_CHALLENGE = gql`
  mutation saveChallenge($input: ChallengeInput) {
    saveChallenge(input: $input) {
      id
      lessonId
      title
      description
      order
    }
  }
`

export const CREATE_CHALLENGE = gql`
  mutation createChallenge($input: ChallengeInput) {
    createChallenge(input: $input) {
      id
      lessonId
      title
      description
      order
    }
  }
`

export const DELETE_LESSON = gql`
  mutation deleteLesson($input: LessonId) {
    deleteLesson(input: $input)
  }
`

export const DELETE_CHALLENGE = gql`
  mutation deleteChallenge($input: ChallengeId) {
    deleteChallenge(input: $input)
  }
`
export const GET_ANNOUNCEMENTS = gql`
  query {
    announcements {
      id,
      description
    }
  }
`
export const USER_DATA = gql`
  query userInfo($in: UserInput){
    userInfo(input: $in){
      name,
      createdAt,
      stars { studentId ,comment, lessonId },
      lessons{
        title
      }
    }
  }
`
export const SET_ADMIN = gql`
  mutation($in: UserAdmin){
    toggleAdmin(input: $in){
      id,
      isAdmin
    }
  }
`
export const SEND_FORGOT_EMAIL = gql`
  mutation($input: String){
    sendPasswordResetEmail(value: $input )
  }
`
export const INVITE_TO_COHORT = gql`
  mutation($input: inviteToCohort){
    inviteToCohort(value: $input)
  }
`
export const CREATE_A_COHORT = gql`
  mutation{
    createCohort{ id, chatroomId }
  }
`

export const GET_WAITLIST_STUDENTS = gql`
   query getWaitListStudents{
    getWaitListStudents{
      email, id, cohortId
    },
    getCohorts{ chatroomId, id }
   }
`

export const FORGOT_RESET_PASSWORD = gql`
  mutation($input: PasswordChange){
    forgotResetPassword(input: $input)
  }
`
export const GET_USERNAME = gql`
  query getUsername($input: String){
    getUsername(userId: $input){
      username
    }
  }
`
export const RESEND_EMAIL_CONFIRMATION = gql`
  mutation($input: String){
    resendEmailConfirmation(value: $input)
  }
`
export const DELETE_ANNOUNCEMENT = gql`
  mutation delete($input: String){
    deleteAnnouncement(value: $input) {
      id,
      description
    }
  }
`
export const CREATE_ANNOUNCEMENT = gql`
  mutation create($input: String){
    createAnnouncement(value: $input) {
      id,
      description
    }
  }
`

export const TEACHER_PAGE = gql`
  query teacherPage($in: LessonId) {
    ${lessonInfo}
    ${submissions}
    ${students}
  }
`

export const getAnnouncementsContainer = graphql(GET_ANNOUNCEMENTS)
export const getUsersAdminContainer = graphql(USERS)
export const setAdminContainer = graphql(SET_ADMIN)
export const getAdoptedStudentFilterContainer = graphql(ADOPTED_STUDENT_FILTER)
export const submissionsContainer = graphql(SUBMISSIONS, {
  props: ({ data, ownProps }) => ({ data: { ...data, ...ownProps } }),
  options: ({ id }) => ({ variables: { in: { id } } })
})
export const getLessonListContainer = graphql(LESSONS, {
  options: () => ({ variables: { in: { admin: true } } })
})
export const getWaitListContainer = compose(
  graphql(GET_WAITLIST_STUDENTS),
  graphql( CREATE_A_COHORT, {
    name: 'createCohort',
    options: {refetchQueries: ['getWaitListStudents']},
  }),
  graphql( INVITE_TO_COHORT, {
    name: 'inviteCohort',
    options: { refetchQueries: ['getWaitListStudents']}
  })
)
export const getLessonStatusContainer = graphql(LESSON_STATUS, {
  props: ({ data, ownProps }) => ({ data: { ...data, ...ownProps } }),
  options: ({ lid }) => ({ variables: { in: { id: lid } } })
})
export const getTeacherPageContainer = graphql(TEACHER_PAGE, {
  props: ({ data, ownProps }) => ({ data: { ...data, ...ownProps } }),
  options: ({ match }) => ({ variables: { in: { id: match.params.lid } } })
})
