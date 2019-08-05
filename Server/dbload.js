const Sequelize = require('sequelize')
const log = require('./log')(__filename)

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  logging: log.verbose
})

const Announcement = sequelize.define('announcement', {
  description: Sequelize.TEXT
})
const Lesson = sequelize.define('lesson', {
  description: Sequelize.TEXT,
  docUrl: Sequelize.STRING,
  githubUrl: Sequelize.STRING,
  videoUrl: Sequelize.STRING,
  order: Sequelize.INTEGER,
  title: Sequelize.STRING,
  chatUrl: Sequelize.STRING
})

const User = sequelize.define('user', {
  name: Sequelize.STRING,
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING,
  gsId: Sequelize.INTEGER,
  isOnline: Sequelize.BOOLEAN,
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  forgotToken: Sequelize.STRING,
  cliToken: Sequelize.STRING,
  emailVerificationToken: Sequelize.STRING
})

const UserLesson = sequelize.define('userLesson', {
  isPassed: Sequelize.STRING,
  isTeaching: Sequelize.STRING,
  isEnrolled: Sequelize.STRING
})

const Submission = sequelize.define('submission', {
  mrUrl: Sequelize.STRING,
  diff: Sequelize.TEXT,
  comment: Sequelize.TEXT,
  status: Sequelize.STRING,
  viewCount: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

const AdoptedStudent = sequelize.define('adoptedStudent', {
  lessonId: Sequelize.INTEGER
})

const Challenge = sequelize.define('challenge', {
  status: Sequelize.STRING,
  description: Sequelize.TEXT,
  title: Sequelize.STRING,
  order: Sequelize.INTEGER
})

const Star = sequelize.define('star', {
  lessonId: Sequelize.INTEGER,
  comment: Sequelize.STRING
})

Lesson.hasMany(Challenge)
Lesson.belongsToMany(User, { through: { model: UserLesson } })

Star.belongsTo(User, { as: 'student' })
Star.belongsTo(User, { as: 'mentor' })

Submission.belongsTo(User)
Submission.belongsTo(User, { as: 'reviewer' })
Submission.belongsTo(Challenge)
Submission.belongsTo(Lesson)

// Not so necessary
Lesson.hasMany(Submission)
Challenge.hasMany(Submission)

User.belongsToMany(User, { as: 'student', through: AdoptedStudent })
User.belongsToMany(Lesson, { through: { model: UserLesson } })

/*
 * CHAT relationships
 */

const Cohort = sequelize.define('cohort', {
  chatroomId: Sequelize.STRING
})

const WaitList = sequelize.define('waitList', {
  email: Sequelize.STRING,
  token: Sequelize.STRING
})

WaitList.belongsTo(Cohort)

sequelize.sync({ alter: true })

module.exports = {
  Announcement,
  Lesson,
  Cohort,
  Challenge,
  Submission,
  User,
  Star,
  AdoptedStudent,
  UserLesson,
  WaitList,
  sequelize
}
