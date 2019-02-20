# C0D3.com

This is the codebase for the website c0d3.com, which provides a platform for students to learn coding through solving challenges


## How to Start

1. Clone repository
   > SSH - `git clone git@git.c0d3.com:song/c0d3.git`
   > or
   > HTTPS - `git clone https://git.c0d3.com/song/c0d3.git`
2. Get updated changes from gitlab- `git pull`
3. Install necessary libraries - `yarn`
4. Create a frontend and backend url for your app (must be c0d3.com domain) at [apps.c0d3.com](https://apps.c0d3.com)
   > For Example:
   > frontend code is https://tri.c0d3.com with port 9623
   > backend url is https://tri-serv.c0d3.com with port 9643
5. Copy hidden file `.env.example` and name it `.env`

   > Example: to see hidden files - `ls -a`

   > `$ cp .env.example .env`

6. Change the environment file `.env` to map to your server url
7. Create a cypress.env.json file with `baseUrl` to be the same as the
   CLIENT_URL environment variable.

   > Example: `{ baseUrl: https://tri.c0d3.com }` or `{ baseUrl: http://localhost:9623 }`

- Server

  - change server port: SERVER_PORT=your-server-port
  - change server url: HOST_NAME=your-server-url.c0d3.com
  - change server url: REACT_APP_SERVER_URL=https://your-server-url.c0d3.com

- Client
  - change client port: PORT=your-client-port
  - change client url: CLIENT_URL=https://your-client-url.c0d3.com

7. Start the frontend server on the correct port - `yarn start`
8. Start the backend server on the correct port - `supervisor Server/app.js`
9. On the front-end, add landing.html to url
   > For example: https://your-client-url.c0d3.com/landing.html


## Tests

### Functional Tests

#### Cypress Headless Mode
To run functional tests:
  - Run All: `yarn run tf`
  - Run Specific: `yarn run tfs cypress/integration/filename.spec.js`

After functional tests are ran, videos of browser UI interactions and failed test snapshots can be viewed at 
`https://your-client-url.c0d3.com/functional` or `http://localhost:9643/functional`

#### Cypress Browser Mode
If working on local computer, tests can be ran in the chrome browser by following the below steps:

1.  Run express server `supervisor Server/app.js`
2.  Run webpack server `yarn start`
3.  Run cypress server `yarn run cypress:open`
4.  Navigate to cypress pop-up window and click on the specific test
5.  Watch/Interact with new chrome browser dedicated for functional testing


## Databases

### Migration

If you make a copy of postgresdb, you might run into an issue where data is not auto-incrementing. To fix this, refer to this fix: 
https://dba.stackexchange.com/questions/65662/postgres-how-to-insert-row-with-autoincrement-id

### Database Overview

- Lesson (description, docUrl, githubUrl, videoUrl, order, title)
  - hasMany Challenge
  - hasMany Submission
  - belongsToMany User -> UserLesson
- Challenge (status, description, title, order)
  - hasMany Submission
- User (name, username, password, email, gsId, isOnline)
  - belongsToMany User (student) -> AdoptedStudent
  - belongsToMany Lesson -> UserLesson
  - belongsTo Room (lastroom)
  - belongsToMany Room -> UserRoom
- UserLesson (isPassed, isTeaching, isEnrolled)
- Submission (mrUrl, diff, comment, status, viewCount)
  - belongsTo User
  - belongsTo User (reviewer)
  - belongsTo Challenge
  - belongsTo Lesson
- AdoptedStudent (lessonId)
- Star (lessonId)
  - belongsTo User (student)
  - belongsTo User (mentor)
- Room (name, description, isEditable, isPrivate)
  - belongsToMany User -> UserRoom
  - hasMany Message
- Message (content, isEdited)
  - belongsTo Room
  - belongsTo User
- UserRoom (unread, isLastRoom)

