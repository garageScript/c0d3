const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  operatorsAliases: Sequelize.Op,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
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
  title: Sequelize.STRING
})

const User = sequelize.define('user', {
  name: Sequelize.STRING,
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  email: Sequelize.STRING,
  gsId: Sequelize.INTEGER,
  isOnline: Sequelize.BOOLEAN
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
  lessonId: Sequelize.INTEGER
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

const Room = sequelize.define('room', {
  name: Sequelize.STRING,
  description: Sequelize.TEXT,
  isEditable: Sequelize.BOOLEAN,
  isPrivate: Sequelize.BOOLEAN
})

const Message = sequelize.define('message', {
  content: Sequelize.TEXT,
  isEdited: Sequelize.BOOLEAN
})

const UserRoom = sequelize.define('userRoom', {
  unread: Sequelize.INTEGER,
  isLastRoom: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false }
})

User.belongsTo(Room, { as: 'lastroom' }) // Deprecated
User.belongsToMany(Room, { through: { model: UserRoom } })
Room.belongsToMany(User, { through: { model: UserRoom } })

Message.belongsTo(Room)
Message.belongsTo(User)
Room.hasMany(Message)

sequelize.sync({ alter: true })

module.exports = {
  Announcement,
  Lesson,
  Challenge,
  Submission,
  User,
  Star,
  AdoptedStudent,
  UserLesson,
  UserRoom,
  Room,
  Message
}
