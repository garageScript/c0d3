const git = require('simple-git')()
const { exec } = require('child_process')
const prompt = require('prompt')
const { request } = require('graphql-request')

let diff
let username
let userId
let lessons
let lessonsByOrder
let lessonOrder
let lessonId
let challengesByOrder
let challengeOrder
let challengeId
let current

module.exports = async (inputs) => {
  const graphqlEndpoint = getGraphqlEndpoint(inputs)

  try {
    await checkCurrentBranch()
    await getDiffAgainstMaster()
    // Get the username on the server
    return new Promise((resolve, reject) => {
      if (username) return resolve()

      exec('whoami', (error, stdout, stderr) => {
        if (error || stderr) return reject(error || stderr)
        // Removes the new line piped through stdout
        username = stdout
          .split('')
          .slice(0, -1)
          .join('')
        return resolve()
      })
    })
  .then(() => {
    // Query for the user's id
    const usersQuery = `
  query Users($userInfo: UserInput) {
    users(input: $userInfo) {
      id
    }
  } `
    const usersQueryVar = {
      userInfo: {
        username
      }
    }
    return request(graphqlEndpoint, usersQuery, usersQueryVar).then(
      ({ users }) => {
        const [user] = users
        userId = user.id
      }
    )
  })
  .then(() => {
    // Query for the lessons
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
    return request(graphqlEndpoint, lessonsQuery).then(res => {
      lessons = res.lessons
    })
  })
  .then(() => {
    // Prompt for the lessons we want
    lessonsByOrder = lessons
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

    prompt.start()
    return new Promise((resolve, reject) => {
      prompt.get(schema, function (err, result) {
        lessonOrder = result.lessonOrder
        console.log('Command-line input received:')
        console.log('  Lesson Number: ' + lessonOrder)
        if (err) return reject(err)
        const currentLesson = lessonsByOrder[lessonOrder]
        lessonId = currentLesson.id
        if (!currentLesson) {
          return reject('The lesson number you gave does not exist')
        }
        return resolve(currentLesson)
      })
    })
  })
  .then(currentLesson => {
    // Prompt for the challenge we want
    challengesByOrder = currentLesson.challenges
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

    prompt.start()
    return new Promise((resolve, reject) => {
      prompt.get(schema, function (err, result) {
        challengeOrder = result.challengeOrder
        console.log('Command-line input received:')
        console.log('  Challenge Number: ' + challengeOrder)
        if (err) return reject(err)
        const currentChallenge = challengesByOrder[challengeOrder]
        if (!currentChallenge) {
          return reject(
            'The challenge assigned to the number did not exist'
          )
        }
        challengeId = currentChallenge.id
        return resolve()
      })
    })
  })
  .then(() => {
    // Create the diff that is markdown compatible
    return new Promise((resolve, reject) => {
      git.diff([`master..${current}`], (error, stdout, stderr) => {
        if (error || stderr) return reject(error || stderr)
        diff = stdout
        return resolve()
      })
    })
  })
  // From this point onward, all graphql calls are mutating
  // database data.
  .then(() => {
    // Enroll a student
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
  })
  .then(() => {
    // Send a submission to the graphql endpoint
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
  })
  .then(() => {
    console.log('\nYour submission was successfully received')
  })
  .catch(console.log)
  } catch(e) {
    console.error(e)
  }

}

function getGraphqlEndpoint(inputs) {
  if (process.env.TEST) {
    username = inputs.username || inputs.u

    if (inputs.url) {
      return (inputs.url.includes('/graphql', -8)) ?
        inputs.url : `${inputs.url}/graphql`
    }
  }
  return 'https://c0d3.com/graphql'
}

function checkCurrentBranch() {
  return new Promise((resolve, reject) => {
    git.branch((error, stdout, stderr) => {
      if (error || stderr) return reject(error || stderr)
      if (stdout.current === 'master') return reject(`
        You are currently on master. Submissions must come from
        branches that are not master.
        Please make sure that you branch, add, commit, and submit
        correctly.
      `)
      console.log(`You are currently on branch ${stdout.current}`)
      resolve()
    })
  })
}

function getDiffAgainstMaster() {
  return new Promise((resolve, reject) => {
    git.diff([`--color`, `master..${current}`], (error, stdout, stderr) => {
      if (error || stderr) return reject(error || stderr)
      console.log('Differences from your current branch to master\n', stdout)
      if (stdout.length === 0 || stdout === '\n') return reject(
        `Make sure you have committed changes in a different branch. ` +
        `Otherwise, there are no differences in your current branch ` +
        `from your master branch`)
      return resolve()
    })
  })
}
