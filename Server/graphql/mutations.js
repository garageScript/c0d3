const mailGun = require('../mailGun/index')
const { forgotResetPassword } = require('../auth/app')
const nanoid = require('nanoid')
const matterMostService = require('../auth/lib/matterMostService')

const {
  Announcement,
  Cohort,
  AdoptedStudent,
  Challenge,
  Lesson,
  Star,
  Submission,
  User,
  UserLesson,
  WaitList
} = require('../dbload')

module.exports = {
  rejectSubmission: (obj, args, context) => {
    let userSubmission
    const comment = args.input.comment || ''
    return Submission.findOne({
      where: {
        lessonId: args.input.lessonId,
        challengeId: args.input.challengeId,
        userId: args.input.userId
      }
    }).then(d => {
      return d.update({
        status: 'needMoreWork',
        comment,
        reviewerId: context.user.id
      })
    }).then((d) => {
      userSubmission = d
      return Promise.all([Lesson.findById(args.input.lessonId), Challenge.findById(args.input.challengeId), User.findById(args.input.userId), User.findById(context.user.id)])
    }).then(([lesson, challenge, submitter, reviewer]) => {
      if (!lesson || !challenge || !submitter || !reviewer) return userSubmission
      const message = `Hi, I have reviewed your submission  **_${lesson.title}: ${challenge.title}_**, please check your progress [here](<https://c0d3.com/student/${lesson.id}>). Please let me know if you have further questions! \n\n ${comment}`
      matterMostService.sendDirectMessage(submitter.email, reviewer.email, message)
      return userSubmission
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
    let submissionToApprove, author, currentLesson
    const comment = args.input.comment || ''
    const { userId, lessonId, challengeId } = args.input
    return Submission.findOne({
      where: { lessonId, challengeId, userId }
    }).then(d => {
      return d.update({
        status: 'passed',
        reviewerId: context.user.id,
        comment
      })
    }).then((d) => {
      submissionToApprove = d
      return Promise.all([
        User.findById(userId),
        User.findById(context.user.id),
        Challenge.findById(challengeId),
        Lesson.findById(lessonId)])
    }).then(([submitter, reviewer, challenge, lesson]) => {
      if (!submitter || !reviewer || !challenge || !lesson) return submissionToApprove
      author = submitter
      currentLesson = lesson
      const message = `I have approved your submission **_${lesson.title}: ${challenge.title}_**! \n\n ${comment}`
      matterMostService.sendDirectMessage(submitter.email, reviewer.email, message)
      return Promise.all([
        Submission.findAll({
          where: { userId, lessonId },
          include: [{ model: Challenge }, { model: User, as: 'reviewer' }]
        }),
        Challenge.count({ where: { lessonId } }),
        UserLesson.findOrCreate({ where: { userId, lessonId } })
      ])
    }).then(([submissions, challengeCount, userLesson]) => {
      const passedSubmissions = submissions.filter(s => s.status === 'passed')
      const isPassed = passedSubmissions.length === challengeCount
      if (isPassed && !userLesson.isPassed) {
        const message = `Congratulations to @${author.username} for passing and completing **_${currentLesson.title}_**! @${author.username} is now a guardian angel for the students in this channel.`
        const channelName = currentLesson.chatUrl.split('/').pop()
        matterMostService.publicChannelMessage(channelName, message)
        userLesson[0].update({ isPassed: Date.now() })
        return Lesson.findOne({
          where: {
            order: `${+currentLesson.order + 1}`
          }
        })
      }
    }).then(nextLesson => {
      if (!nextLesson) return submissionToApprove
      const channelName = nextLesson.chatUrl.split('/').pop()
      const message = `We have a new student joining us! @${author.username} just completed **_${currentLesson.title}_**.`
      matterMostService.publicChannelMessage(channelName, message)
      return submissionToApprove
    })
  },
  createSubmission: (obj, args, context) => {
    let userSubmission, author
    return User.findOne({
      where: { cliToken: args.input.cliToken }
    }).then((user) => {
      author = user
      if (!user) return
      return Submission.findOrCreate({
        where: {
          lessonId: args.input.lessonId,
          challengeId: args.input.challengeId,
          userId: user.id
        }
      })
    })
      .then(d => {
        if (!d) return
        return d[0].update({
          order: args.input.order,
          diff: args.input.diff,
          mrUrl: args.input.mrUrl,
          status: 'open',
          viewCount: 0
        })
      }).then((d) => {
        userSubmission = d
        return Promise.all([Challenge.findById(d.challengeId), Lesson.findById(userSubmission.lessonId)])
      }).then(([challenge, lesson]) => {
        if (!author || !challenge || !lesson) return userSubmission
        const lessonName = lesson.chatUrl.split('/').pop()
        const message = `@${author.username} has submitted a solution **_${challenge.title}_**. Click [here](<https://c0d3.com/teacher/${lesson.order}>) to review the code.`
        matterMostService.publicChannelMessage(lessonName, message)
        return userSubmission
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
    const mentorId = args.input.userId || context.user.id
    Star.create({
      lessonId: args.input.lessonId,
      studentId: context.user.id,
      mentorId,
      comment: args.input.comment
    }).then(() => {
      return Promise.all([User.findById(mentorId), Lesson.findById(args.input.lessonId)])
    }).then(([user, lesson]) => {
      const channelName = lesson.chatUrl.split('/').pop()
      const message = `@${user.username} received a star!`
      matterMostService.publicChannelMessage(channelName, message)
    })
    return 'Success'
  },
  createAnnouncement: (obj, args, context) => {
    return Announcement.create({
      description: args.value
    })
  },
  createCohort: async (obj, args, context) => {
    const cohort = await Cohort.create({})
    const chat = await matterMostService.createCohortChannel(cohort.dataValues.id)
    cohort.update({ chatroomId: chat.data.id })
    return cohort
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
  },
  sendPasswordResetEmail: (obj, args, context) => {
    const randomToken = nanoid()
    const { value } = args
    return User.findOne({ where: { email: value } }).then(user => {
      if (!user) return 'User not found'
      mailGun.sendPasswordResetEmail(user, randomToken)
      user.update({ forgotToken: randomToken })
      return 'Success'
    })
  },
  inviteToCohort: (obj, args, context) => {
    Promise.all([
      WaitList.findOne({
        where: { id: args.value.waitListId }
      }),
      Cohort.findAll({
        limit: 1,
        order: [['createdAt', 'DESC']]
      })
    ])
      .then(([w, c]) => {
        const cohortId = c[0].dataValues.id
        w.update({ cohortId })
        mailGun.sendInviteEmail({ email: w.email, cohortId })
      })
      .then(a => 'Email is sent successfully')
  },
  forgotResetPassword: (obj, args, context) => {
    const { forgotToken, password } = args.input
    User.findOne({ where: { forgotToken: forgotToken } }).then(user => {
      if (!user) return 'User not found'
      forgotResetPassword(forgotToken, password, user)
      user.update({ forgotToken: '' })
      return 'Success'
    })
  },
  resendEmailConfirmation: (obj, args, context) => {
    const { value } = args
    return User.findOne({ where: { emailVerificationToken: value } }).then(user => {
      if (!user) return 'User not found'
      mailGun.sendEmailVerifcation({ email: user.email, username: user.username }, user.emailVerificationToken)
      return 'Success'
    })
  },
  deleteWaitlistStudent: (obj, args, contect) => {
    WaitList.findOne({
      where: { id: args.value.waitListId }
    }).then(deleteWaitlistStudent => WaitList.destroy())
    WaitList.update()
    return 'Selected Waitlist Student has been deleted'
  }
}
