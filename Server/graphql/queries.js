const Sequelize = require('sequelize')
const Op = Sequelize.Op

const getLessonListDetails = (userId) => {
  return Lesson.findAll({
    include: [
      {
        model: User,
        required: false,
        where: {
          id: userId
        },
        through: {
          model: UserLesson,
          attributes: ['isPassed', 'isTeaching', 'isEnrolled']
        }
      }
    ]
  }).then(lessons => {
    return lessons.map(l => {
      const lesson = { ...l.dataValues }
      lesson.currentUser = lesson.users[0] || {
        userLesson: { isTeaching: '', isPassed: '' }
      }
      return lesson
    })
  })
}

const {
  Lesson,
  UserLesson,
  Star,
  User,
  Challenge,
  Submission,
  AdoptedStudent,
  Announcement
} = require('../dbload')

module.exports = {
  users: (obj, args, context) => {
    if (!Object.keys(args.input || {}).length) {
      return User.findAll()
    }
    const { username, userId } = args.input
    const variablesToMatch = {}
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
    return getLessonListDetails(context.user.id)
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
        if (!res) return null
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
          lessonStatus.starComment = star.comment
        }
        return lessonStatus
      })
  },

  teachers: (obj, args, context) => {
    return User.findAll({
      order: [ ['updatedAt', 'DESC'] ],
      where: {
        id: { [Op.not]: context.user.id }
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
    const userId = args.input.userId || context.user.id
    const lessonId = args.input.lessonId
    return Promise.all([
      Submission.findAll({
        where: { userId, lessonId },
        include: [{ model: Challenge }, { model: User, as: 'reviewer' }]
      }),
      Challenge.count({ where: { lessonId } }),
      UserLesson.findOrCreate({ where: { userId, lessonId } })
    ]).then(([submissions, challengeCount, userLesson]) => {
      /* Remove the following after 2 months.
       *   This should be addressed in the mutation call for submissin approvals.
       *   For 3 - 6 months, no UserLesson were created for certain users.
       *   Therefore, the following code must exist to remedy the issue.
       *   Implemented on May 12, 2019, should be removed after July 12, 2019
       */
      const passedSubmissions = submissions.filter(s => s.status === 'passed')
      if (passedSubmissions.length === challengeCount && !userLesson.isPassed) {
        userLesson[0].update({ isPassed: Date.now() })
        return submissions
      }
      return submissions
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
    return Submission.findAll({
      where: {
        lessonId: args.input.id,
        status: {
          [Op.ne]: 'passed'
        }
      },
      include: ['user', 'challenge', { model: User, as: 'reviewer' }]
    })
  },

  announcements: (obj, args, context) => {
    return Announcement.findAll({
      order: [ ['id', 'DESC'] ]
    })
  },

  userInfo: (obj, args, context) => {
    const userData = {}
    return User.findOne({
      where: {
        username: args.input.username
      }
    }).then(user => {
      if (!user) return []
      userData.id = user.id
      userData.name = user.name
      userData.createdAt = user.createdAt
      return Star.findAll({
        where: { mentorId: userData.id }
      })
    }).then(allStars => {
      userData.stars = allStars.filter(star =>
        star.studentId !== userData.id
      )
      return getLessonListDetails(userData.id)
    }).then(lessons => {
      return lessons.filter(lesson => {
        return lesson.currentUser.userLesson.isPassed
      })
    }).then(lessons => {
      userData.lessons = lessons
      return userData
    })
  },

  getUsername: (obj, args, context) => {
    return User.findOne({
      where: {
        id: args.userId
      }
    })
  }
}
