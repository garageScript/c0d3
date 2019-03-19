
const {
  Announcement,
  AdoptedStudent,
  Challenge,
  Lesson,
  Star,
  Submission,
  User,
  UserLesson
} = require('../dbload')

module.exports = {
  enrollStudent: (obj, args, context) => {
    return UserLesson.findOrCreate({
      where: {
        lessonId: args.input.id,
        userId: args.input.userId || context.user.id
      }
    }).then(d => {
      d[0].update({ isEnrolled: Date.now() })
      return d
    })
  },
  rejectSubmission: (obj, args, context) => {
    return Submission.findOne({
      where: {
        lessonId: args.input.lessonId,
        challengeId: args.input.challengeId,
        userId: args.input.userId
      }
    }).then(d => {
      return d.update({
        status: 'needMoreWork',
        comment: args.input.comment || '',
        reviewerId: context.user.id
      })
    })
  },
  makeTeacher: (obj, args, context) => {
    return UserLesson.update(
      { isTeaching: Date.now() },
      {
        where: {
          lessonId: args.input.id,
          userId: args.input.userId
        }
      }
    ).then(res => 'YAY someone is a teacher!')
  },
  unMakeTeacher: (obj, args, context) => {
    return UserLesson.update(
      { isTeaching: null },
      {
        where: {
          lessonId: args.input.id,
          userId: args.input.userId
        }
      }
    ).then(res => 'COOL, they probably deserved it.')
  },
  adoptStudent: (obj, args, context) => {
    return AdoptedStudent.findOrCreate({
      where: {
        userId: context.user.id,
        studentId: args.input.userId,
        lessonId: args.input.lessonId
      }
    }).then(d => 'Success')
  },
  unAdoptStudent: (obj, args, context) => {
    return AdoptedStudent.destroy({
      where: {
        userId: context.user.id,
        studentId: args.input.userId,
        lessonId: args.input.lessonId
      }
    }).then(d => 'Success')
  },
  unapproveSubmission: (obj, args, context) => {
    return Submission.findOne({
      where: {
        lessonId: args.input.lessonId,
        challengeId: args.input.challengeId,
        userId: args.input.userId
      }
    }).then(d => {
      return d.update({
        status: 'open',
        reviewerId: context.user.id
      })
    })
  },
  approveSubmission: (obj, args, context) => {
    let submissionToApprove
    return Submission.findOne({
      where: {
        lessonId: args.input.lessonId,
        challengeId: args.input.challengeId,
        userId: args.input.userId
      }
    })
      .then(d => {
        submissionToApprove = d
        return d.update({
          status: 'passed',
          reviewerId: context.user.id,
          comment: args.input.comment || ''
        })
      })
      .then(() => {
        return Submission.findAll({
          where: {
            lessonId: args.input.lessonId,
            userId: args.input.userId
          }
        })
      })
      .then(submissions => {
        return Challenge.findAll({
          where: {
            lessonId: args.input.lessonId
          }
        }).then(challenges => {
          let challengeId = {}
          challenges.map(challenge => {
            return (challengeId[challenge.id] = false)
          })
          submissions.forEach(submission => {
            if (submission.status === 'passed') {
              challengeId[submission.challengeId] = true
            }
          })
          let passed = true
          Object.values(challengeId).forEach(v => {
            if (!v) passed = false
          })
          return passed
        })
      })
      .then(updateIsPassed => {
        if (updateIsPassed) {
          return UserLesson.update(
            { isPassed: Date.now() },
            {
              where: {
                lessonId: args.input.lessonId,
                userId: args.input.userId
              }
            }
          )
        }
      })
      .then(() => {
        return submissionToApprove
      })
  },
  createSubmission: (obj, args, context) => {
    return Submission.findOrCreate({
      where: {
        lessonId: args.input.lessonId,
        challengeId: args.input.challengeId,
        userId: args.input.userId
      }
    })
      .then(d => {
        return d[0].update({
          order: args.input.order,
          diff: args.input.diff,
          mrUrl: args.input.mrUrl,
          status: 'open',
          viewCount: 0
        })
      })
      .then(d => {
        return d
      })
  },
  createLesson: (obj, args) => {
    // TODO: Make a scheme to order lessons correctly
    return Lesson.create(args.input)
  },
  saveLesson: (obj, args) => {
    const { id } = args.input
    return Lesson.findById(id).then(lesson => lesson.update(args.input))
  },
  deleteChallenge: (obj, args) => {
    const { id } = args.input
    return Challenge.findById(id)
      .then(challenge => challenge.destroy())
      .then(d => 'Success')
  },
  deleteLesson: (obj, args) => {
    const { id } = args.input
    return Lesson.findById(id)
      .then(lesson => lesson.destroy())
      .then(d => 'Success')
  },
  createChallenge: (obj, args) => {
    return Challenge.create(args.input)
  },
  saveChallenge: (obj, args) => {
    const { id } = args.input
    return Challenge.findById(id).then(challenge =>
      challenge.update(args.input)
    )
  },
  giveStar: (obj, args, context) => {
    Star.create({
      lessonId: args.input.lessonId,
      studentId: context.user.id,
      mentorId: args.input.userId || context.user.id,
      comment: args.input.comment
    })
    return 'Success'
  },
  createAnnouncement: (obj, args, context) => {
    return Announcement.create({
      description: args.value
    })
  },
  deleteAnnouncement: (obj, args, context) => {
    return Announcement.destroy({
      where: {
        id: args.value
      }
    }).then(() => {
      return Announcement.findAll({
        order: [ ['id', 'DESC' ] ]
      })
    })
  },
  toggleAdmin: (obj, args, context) => {
    const { userId, isAdmin } = args.input
    return User.findById(userId).then(user => {
      return user.update({ isAdmin })
    })
  }
}
