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

module.exports = (inputs) => {
  const graphqlEndpoint = getGraphqlEndpoint(inputs)

  return (
    new Promise((resolve, reject) => {

      // Check current branch
      git.branch((error, stdout, stderr) => {
        if (error || stderr) return reject(error || stderr)
        current = stdout.current
        if (current === 'master') {
          return reject(`
          You are currently on master. Submissions must come from
          branches that are not master.
          Please make sure that you branch, add, commit, and submit
          correctly.
        `)
        }
        console.log(`You are currently on branch ${current}`)
        return resolve()
      })
    })
      .then(() => {
        // Create a diff against master
        return new Promise((resolve, reject) => {
          git.diff(
            [`--color`, `master..${current}`],
            (error, stdout, stderr) => {
              if (error || stderr) return reject(error || stderr)
              console.log('Differences from your current branch to master')
              const colorizedDiff = stdout
              console.log(colorizedDiff)
              if (colorizedDiff.length === 0 || colorizedDiff === '\n') {
                return reject(
                  `Make sure you have committed changes in a different branch. ` +
                    `Otherwise, there are no differences in your current branch from your master branch`
                )
              }
              return resolve()
            }
          )
        })
      })
      .then(() => {
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
      // Code that checks relevant files will be disabled
      /*
      .then(() => {
        // Check if all files are relevant
        return new Promise((resolve, reject) => {
          git.diffSummary([`master..${current}`], (error, stdout, stderr) => {
            if (error || stderr) return reject(error || stderr);
            const diffSummary = stdout;

            // Reject any submission without file differences
            if (diffSummary.files.length === 0) {
              return reject(
                `There are no file differences.\n` +
                  `Please make sure that you have added and committed files.`
              );
            }

            // WARNING: Hardcoded and will break if folder naming structure is changed
            const currentFolder =
              lessonOrder < lessons.length - 1 ? `js${lessonOrder}` : `end2end`;

            const currentChallenge = `${challengeOrder}.js`;
            // WARNING: Hardcoded and will break if lesson and challenge
            // orders are changed
            for (const { file } of diffSummary.files) {
              // Specific cases are needed for some challenges
              if (
                Number(lessonOrder) === lessons.length - 1 &&
                Number(challengeOrder) === 8 &&
                (file === `curriculum/${currentFolder}/7.js` ||
                  file === `curriculum/${currentFolder}/8.js`)
              )
                continue;
              if (
                file !== `curriculum/${currentFolder}/${currentChallenge}` &&
                file !== `curriculum/${currentFolder}/package.json`
              ) {
                return reject(`
                File ${file} should not be a part of this challenge.
                Make sure that only "curriculum/${currentFolder}/${currentChallenge}"
                or a required "package.json" is included in this merge request.
                You may need to rebase off of our most recent version of the curriculum,
                or you may have committed unnecessary files.
              `);
              }
            }
            return resolve();
          });
        });
      })
      */
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
  )
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
