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
  submissions(input: LessonId, where: SubmissionWhere): [Submission]

  "Get all lesson submissons for a specific user"
  userSubmissions(input: LessonUserId): [Submission]

  "Get all adopted students for signed-in user"
  students(input: LessonId): [User]

  "Get teachers that adopted the signed-in user"
  teachers(input: LessonId): [User]

  "Given stars"
  givenStars: [Star]

  "Recieved Stars"
  receivedStars(input: UserInput):[Star]
}

type Mutation {
  enrollStudent(input: LessonId): UserLesson
  giveStar(input: LessonUserId): String
  adoptStudent(input: LessonUserId): String
  unAdoptStudent(input: LessonUserId): String
  createSubmission(input: SubmissionInput): Submission
  unapproveSubmission(input: SubmissionEdit): Submission
  approveSubmission(input: SubmissionEdit): Submission
  rejectSubmission(input: SubmissionEdit): Submission
  viewSubmission(input: SubmissionEdit): Submission
  makeTeacher(input: LessonId): String
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
}

input UserInput {
  username: String
  userId: String
}
  input SubmissionWhere{
    status: String
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
}

input SubmissionInput {
  challengeId: String
  mrUrl: String
  order: Int
  diff: String
  lessonId: String
  userId: String
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
  studentId: String,
  lessonId: String,
}

type User {
  id: String
  username: String
  userLesson: UserLesson
}

type UserLesson {
  id: String
  userId: String
  lessonId: String
  isPassed: String
  isTeaching: String
  isEnrolled: String
  starGiven: User
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
  student: User
  mentor: User
}
`
