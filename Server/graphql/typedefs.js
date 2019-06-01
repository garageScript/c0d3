module.exports = `
type Query {

  "Get user info"
  users(input: UserInput): [User]

  "Get all lessons available"
  lessons: [Lesson]

  "Get status for the curriculum"
  curriculumStatus: [Lesson]

  "Get lesson progress for signed in user"
  lessonStatus(input: LessonId): UserLesson

  "Get generic lesson information"
  lessonInfo(input: LessonId): Lesson

  "Find challenges for a specific lesson"
  challenges(input: LessonId): [Challenge]

  "Get all challenges status for a specific lesson"
  challengeStatus(input: ChallengeId): Submission

  "Get all challenges for a specific lesson"
  submissions(input: LessonId): [Submission]

  "Get all lesson submissons for a specific user"
  userSubmissions(input: LessonUserId): [Submission]

  "Get all adopted students for signed-in user"
  students(input: LessonId): [User]

  "Get teachers that adopted the signed-in user"
  teachers(input: LessonId): [User]

  "Given stars"
  givenStars: [Star]

 "Received Stars"
  receivedStars(input: UserInput):[Star]

  "Get Announcements"
  announcements: [Announcement] 

  "Get UserInfo"
  userInfo(input: UserInput): UserData
  
  "Get username"
  getUsername(userId: String): User

  "Get all the Cohorts"
  getCohorts: [ Cohort] 

}

type Mutation {
  "Create a star and assign it to the mentor"
  giveStar(input: LessonUserId): String
  
  "Create adopted student for signed-in-user"
  adoptStudent(input: LessonUserId): String
  
  "Delete adopted student for signed-in-user"
  unAdoptStudent(input: LessonUserId): String

  "Create submission for signed-in-user"
  createSubmission(input: SubmissionInput): Submission

  "Update submitted lesson"  
  unapproveSubmission(input: SubmissionEdit): Submission

  "Update user lesson"
  approveSubmission(input: SubmissionEdit): Submission

  "Update user lesson"
  rejectSubmission(input: SubmissionEdit): Submission

  "Update student to mentor"
  makeTeacher(input: LessonId): String

  "Update mentor to student"
  unMakeTeacher(input: LessonId): String

  "Create a new lesson"
  createLesson(input: LessonInput): Lesson

  "Updates the lesson with the given fields. If a field is empty it will not be updated"
  saveLesson(input: LessonInput): Lesson

  "Delete a challenge. This currently does not delete in a cascade all submissions attached to it"
  deleteChallenge(input: ChallengeId): String

  "Delete a lesson. This currently does not delete in a cascade all challenges"
  deleteLesson(input: LessonId): String

  "Create a challenge for a given lesson"
  createChallenge(input: ChallengeInput): Challenge

  "Updates the selected challenge"
  saveChallenge(input: ChallengeInput): Challenge

  "Create a new announcement"
  createAnnouncement(value: String): Announcement

  "Delete an announcement"
  deleteAnnouncement(value: String): [Announcement]

  "Toggle User Admin"
  toggleAdmin(input: UserAdmin): User 

  "Send email with Mailgun"
  sendPasswordResetEmail(value: String): String

  "Send invite email to join C0d3 using Mailgun"
  inviteToCohort(value: inviteToCohort): String 

  "Reset password for non-authorized clients"
  forgotResetPassword(input: PasswordChange): String

  "Resend email confirmation"
  resendEmailConfirmation(value: String): String

}

input PasswordChange {
  forgotToken: String!
  password: String!
}

input UserAdmin {
  userId: String
  isAdmin: Boolean
}
input UserInput {
  username: String
  userId: String
}

input LessonId {
  id: String

  "userId is used to obtain submissions to a specific user"
  userId: String

  "challengeId is used to obtain submissions to a specific challenge"
  challengeId: String
}

input ChallengeId {
  id: String
}

input LessonUserId {
  lessonId: String
  userId: String
  comment: String
}

input ChallengeInput {
  id: String
  lessonId: String
  title: String
  description: String
  order: Int
}

input LessonInput {
  id: String
  description: String
  docUrl: String
  githubUrl: String
  videoUrl: String
  order: Int
  title: String
  chatUrl: String
}

input SubmissionInput {
  challengeId: String
  mrUrl: String
  order: Int
  diff: String
  lessonId: String
  userId: String
  cliToken: String
}

input SubmissionEdit {
  challengeId: String
  mrUrl: String
  order: Int
  comment: String
  diff: String
  lessonId: String
  userId: String
  reviewerId: String
}

type Submission {
  id: String
  status: String
  mrUrl: String
  diff: String
  viewCount: Int
  comment: String
  userId: String
  order: Int
  lessonId: String
  challengeId: String
  challenge: Challenge
  reviewer: User
  user: User
  reviewerId: String
  createdAt: String
  updatedAt: String
}

type AdoptedStudent {
  userId: String,
  studentId: String
  lessonId: String
}

type User {
  id: String
  username: String
  userLesson: UserLesson
  email: String
  name: String
  isAdmin: Boolean
}

type UserLesson {
  id: String
  userId: String
  lessonId: String
  isPassed: String
  isTeaching: String
  isEnrolled: String
  starGiven: User
  starComment: String
}

type Lesson {
  id: String
  description: String
  docUrl: String
  githubUrl: String
  videoUrl: String
  order: Int
  title: String
  challenges: [Challenge]
  users: [User]
  currentUser: User
  chatUrl: String
}

type Challenge {
  id: String
  description: String
  lessonId: String
  title: String
  order: Int
}

type Star {
  lessonId: String
  studentId: String
  mentorId: String
  comment: String
}

type Announcement {
  id: String
  description: String
}

type UserData {
  name: String,
  createdAt: String,
  stars: [Star]
  lessons: [Lesson]
}

type Cohort {
  chatroomId: String 
}

input inviteToCohort {
  waitListId: String
  chatroomId: String
}
`
