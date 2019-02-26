const Sequelize = require('sequelize')

const Op = Sequelize.Op

const {
  Lesson,
  UserLesson,
  Star,
  User,
  Challenge,
  Submission,
  AdoptedStudent
} = require('../dbload')

module.exports = {
  users: (obj, args, context) => {
    const variablesToMatch = {}
    const { username, userId } = args.input
    if (username) {
      variablesToMatch.username = username
    }
    if (userId) {
      variablesToMatch.id = userId
    }
    return User.findAll({
      where: variablesToMatch
    })
  },

  givenStars: (obj, args, context) => {
    return Star.findAll({
      where: {
        studentId: context.user.id
      },
      include: ['student', 'mentor']
    })
  },

  receivedStars: (obj, args, context) => {
    return Star.findAll({
      where: {
        mentorId: args.input.userId
      },
      include: ['student']
    })
  },

  lessons: (obj, args, context) => {
    return Lesson.findAll({
      include: [
        'challenges',
        {
          model: User,
          through: {
            attributes: ['isPassed', 'isTeaching', 'isEnrolled']
          }
        }
      ]
    })
  },

  curriculumStatus: (obj, args, context) => {
    return Lesson.findAll({
      include: [
        {
          model: User,
          required: false,
          where: {
            id: context.user.id
          },
          through: {
            model: UserLesson,
            attributes: ['isPassed', 'isTeaching', 'isEnrolled']
          }
        }
      ]
    }).then(lessons => {
      return [...lessons].map(lesson => {
        lesson.currentUser = lesson.users[0] || {
          userLesson: { isTeaching: '', isPassed: '' }
        }
        return lesson
      })
    })
  },

  lessonStatus: (obj, args, context) => {
    let lessonStatus = {}
    return UserLesson.findOne({
      where: {
        userId: args.input.userId || context.user.id,
        lessonId: args.input.id
      }
    })
      .then(res => {
        lessonStatus = res
        return Star.findOne({
          where: {
            studentId: args.input.userId || context.user.id,
            lessonId: args.input.id
          },
          include: ['mentor']
        })
      })
      .then(star => {
        if (star && star.mentor) {
          lessonStatus.starGiven = star.mentor
        }
        return lessonStatus
      })
  },

  teachers: (obj, args, context) => {
    return User.findAll({
      include: {
        model: User,
        as: 'student',
        through: {
          model: AdoptedStudent,
          where: {
            lessonId: args.input.id
          }
        },
        where: {
          id: context.user.id
        }
      }
    })
  },

  lessonInfo: (obj, args, context) => {
    return Lesson.findById(args.input.id, {
      include: [
        {
          model: Challenge
        },
        {
          model: User,
          through: {
            attributes: ['isEnrolled', 'isPassed', 'isTeaching'],
            where: {
              isEnrolled: {
                [Op.ne]: null
              }
            }
          }
        }
      ]
    })
  },

  challengeStatus: (obj, args, context) => {
    return Submission.findOne({
      where: { userId: context.user.id, challengeId: args.input.id },
      include: [{ model: User, as: 'reviewer' }, 'user']
    })
  },

  userSubmissions: (obj, args, context) => {
    return Submission.findAll({
      where: {
        userId: args.input.userId || context.user.id,
        lessonId: args.input.lessonId
      },
      include: [{ model: Challenge }, { model: User, as: 'reviewer' }]
    })
  },

  students: (obj, args, context) => {
    return User.findById(args.input.userId || context.user.id, {
      include: [
        {
          model: User,
          as: 'student',
          through: {
            attributes: ['lessonId'],
            where: { lessonId: args.input.id }
          }
        }
      ]
    }).then(d => {
      return d.student
    })
  },

  submissions: (obj, args, context) => {
    const valuesToMatch = Object.assign({}, args.input, args.where)
    valuesToMatch.lessonId = args.input.id
    delete valuesToMatch.id

    return Submission.findAll({
      where: valuesToMatch,
      include: ['user', 'challenge', { model: User, as: 'reviewer' }]
    })
  }
}
