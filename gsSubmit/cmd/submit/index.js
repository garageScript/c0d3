const chalk = require('chalk')
const { URL } = require('url')
const git = require('simple-git')()
const prompt = require('prompt')
const { request } = require('graphql-request')
const credService = require('../util/credentials.js')

module.exports = async (inputs) => {
  try {
    const credentials = await credService.getCredentials()
    const url = inputs.url
      ? new URL('/cli/signin', inputs.url) : new URL('/cli/signin', 'https://c0d3.com')

    if (!credentials.token) {
      const success = await credService.validate(credentials, url.href)
      if (!success) return console.error('Invalid Credentials')
      credService.save(credentials)
    }

    const currentBranch = await checkCurrentBranch()
    await getDiffAgainstMaster(currentBranch)

    const graphqlEndpoint = getGraphqlEndpoint(inputs).href
    if (process.env.TEST && (inputs.username || inputs.u)) {
      credentials.username = inputs.username || inputs.u
    }
    const userId = await getUserId(credentials.username, graphqlEndpoint)
    const lessons = await queryForLessons(graphqlEndpoint)
    const currentLesson = await promptForLessons(lessons)
    const challengeId = await promptForChallenge(currentLesson)
    const diff = await createDiff(currentBranch)

    // From this point onward, all graphql calls are mutating
    // database data.
    await enrollStudent(currentLesson.id, userId, graphqlEndpoint)
    await sendSubmission(currentLesson.id, userId, diff, challengeId, graphqlEndpoint)
  } catch (e) {
    console.error(e)
  }
}

function getGraphqlEndpoint (inputs) {
  if (inputs.url) return new URL('/graphql', inputs.url)
  return new URL('/graphql', 'https://c0d3.com')
}

function checkCurrentBranch () {
  return new Promise((resolve, reject) => {
    git.branch((error, stdout, stderr) => {
      if (error || stderr) return reject(error || stderr)
      console.log('\nYou are currently on branch ' +
        chalk.bold.blue(stdout.current))
      if (stdout.current === 'master') {
        return reject('Submissions ' +
        'must come from branches that are ' + chalk.bold.red('not master. ') +
        'Please make sure that you branch, add, commit, and submit correctly.')
      }
      resolve(stdout.current)
    })
  })
}

function getDiffAgainstMaster (current) {
  return new Promise((resolve, reject) => {
    git.diff([`--color`, `master..${current}`], (error, stdout, stderr) => {
      if (error || stderr) return reject(error || stderr)
      if (stdout.length === 0 || stdout === '\n') {
        return reject(
          'There are ' + chalk.bold.red('no differences ') +
        'in your current branch from your master branch.')
      }
      console.log(`Differences from your current branch to master\n\n`, stdout)
      return resolve()
    })
  })
}

function getUserId (username, graphqlEndpoint) {
  const usersQuery = `
  query Users($userInfo: UserInput) {
    users(input: $userInfo) {
      id
    }
  }`

  const usersQueryVar = {
    userInfo: {
      username
    }
  }

  return request(graphqlEndpoint, usersQuery, usersQueryVar)
    .then(({ users }) => {
      const [user] = users
      return user.id
    }
    )
}

function queryForLessons (graphqlEndpoint) {
  const lessonsQuery = `
  {
    lessons {
      id
      title
      challenges {
        id
        title
        order
      }
      order
    }
  }`
  return request(graphqlEndpoint, lessonsQuery).then(res => res.lessons)
}

function promptForLessons (lessons) {
  const lessonsByOrder = lessons
    .sort((a, b) => a.order - b.order)
    .reduce((acc, { order, id, title, challenges }) => {
      console.log(`Enter ${order} to submit to lesson: ${title}. `)
      acc[order] = {
        title,
        challenges,
        id
      }
      return acc
    }, {})

  const schema = {
    properties: {
      lessonOrder: {
        pattern: /^[0-9][0-9]*$/,
        message:
          'The lesson number needs to be a non-negative integer.\n' +
          'To cancel submission, press Ctrl + d',
        required: true
      }
    }
  }

  prompt.message = ''
  prompt.start()
  return new Promise((resolve, reject) => {
    prompt.get(schema, function (err, result) {
      console.log('Command-line input received:')
      console.log('  Lesson Number: ' + result.lessonOrder)
      if (err) return reject(err)
      const currentLesson = lessonsByOrder[result.lessonOrder]
      if (!currentLesson) {
        return reject('The lesson number you gave does not exist')
      }
      return resolve(currentLesson)
    })
  })
}

function promptForChallenge (currentLesson) {
  const challengesByOrder = currentLesson.challenges
    .sort((a, b) => a.order - b.order)
    .reduce((acc, { title, order, id }) => {
      console.log(`Enter ${order} to submit to challenge: ${title}. `)
      acc[order] = {
        title,
        id
      }
      return acc
    }, {})

  const schema = {
    properties: {
      challengeOrder: {
        pattern: /^[0-9][0-9]*$/,
        message:
          'The challenge number needs to be a non-negative integer.\n' +
          'To cancel submission, press Ctrl + d',
        required: true
      }
    }
  }

  prompt.message = ''
  prompt.start()
  return new Promise((resolve, reject) => {
    prompt.get(schema, function (err, result) {
      console.log('Command-line input received:')
      console.log('  Challenge Number: ' + result.challengeOrder)
      if (err) return reject(err)
      const currentChallenge = challengesByOrder[result.challengeOrder]
      if (!currentChallenge) {
        return reject(
          'The challenge assigned to the number did not exist'
        )
      }
      return resolve(currentChallenge.id)
    })
  })
}

function createDiff (currentBranch) {
  return new Promise((resolve, reject) => {
    git.diff([`master..${currentBranch}`], (error, stdout, stderr) => {
      if (error || stderr) return reject(error || stderr)
      return resolve(stdout)
    })
  })
}

function enrollStudent (lessonId, userId, graphqlEndpoint) {
  const enrollMutation = `
  mutation enrollStudent($input: LessonId) {
    enrollStudent(input: $input) {
      isPassed
      isTeaching
      isEnrolled
    }
  }`
  const enrollVariables = {
    input: {
      id: lessonId,
      userId: `${userId}`
    }
  }
  return request(graphqlEndpoint, enrollMutation, enrollVariables)
}

function sendSubmission (lessonId, userId, diff, challengeId, graphqlEndpoint) {
  const createSubmission = `
  mutation CreateSubmission($submission: SubmissionInput) {
    createSubmission(input: $submission) {
      id
      diff
      order
    }
  }`

  const variablesForCreation = {
    submission: {
      lessonId,
      challengeId,
      userId: `${userId}`,
      diff
    }
  }

  return request(graphqlEndpoint, createSubmission, variablesForCreation)
    .then(() => console.log('\nYour submission was successfully received'))
}
