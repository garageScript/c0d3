# C0D3.com
This is the codebase for the website c0d3.com, which provides a platform for students to learn coding through solving challenges online.

## How to Start

The following will describe how to setup your own development server.  You have the option to setup your development server on either your local machine, or within c0d3's server. The process described below works for both cases.

NOTE: If you choose to setup your development server locally, you must install the following on your local machine BEFORE proceeding:

      a. install node.js
      b. install git
      c. install secure shell(only if you are working with an older version of windows.  Windows 10 will have secure shell pre-installed)

1. Clone repository
   > SSH - `git clone git@git.c0d3.com:song/c0d3.git`
   > or
   > HTTPS - `git clone https://git.c0d3.com/song/c0d3.git`
2. Install necessary libraries - `yarn`
3. Create a frontend and backend url for your app (must be c0d3.com domain) at [apps.c0d3.com](https://apps.c0d3.com)
   > For Example:
   > frontend code is https://tri.c0d3.com with port 9623
   > backend url is https://tri-serv.c0d3.com with port 9643

   Note:  When creating the frontend and backend url, DO NOT manually define your own port.  Leave the port number input field blank and a port number will be automatically
   generated for you.

4. Copy hidden file `.env.example` and name it `.env`

   > Example: to see hidden files - `ls -a`

   > `$ cp .env.example .env`

5. Change the environment file `.env` to map to your server url by opening `.env` and modifying the following parameters:

- Server related parameters

  - change server port: SERVER_PORT=your-server-port
  - change server url: HOST_NAME=your-server-url.c0d3.com
  - change server url: REACT_APP_SERVER_URL=https://your-server-url.c0d3.com

- Client related parameters

  - change client port: PORT=your-client-port
  - change client url: CLIENT_URL=https://your-client-url.c0d3.com

6. Start the backend server on the correct port - `supervisor Server/app.js`
7. Start the frontend server on the correct port - `yarn start`
8. On the front-end, add landing.html to url
   > For example: https://your-client-url.c0d3.com/landing.html

9. Create a cypress.env.json file with `baseUrl` to be the same as the
   CLIENT_URL environment variable.

   > Example: `{ baseUrl: https://tri.c0d3.com }` or `{ baseUrl: http://localhost:9623 }`

10. (Optional) For CLI tool  
  - Change to the gsSubmit directory: `cd gsSubmit`  
  - Install dependencies: `npm install`  
  - Link the c0d3 cli tool to be ran anywhere: `npm link`
  - Submit challenges from git directory: `c0d3 submit --url "https://your-server-url"`
  - You can also submit as another user: `TEST=true c0d3 submit --url "https://your-server-url" --username "another_user"`



## Tests

### Functional Tests

#### Cypress Headless Mode
To run functional tests:
  - Run All: `yarn run tf`
  - Run Specific: `yarn run tfs cypress/integration/filename.spec.js`

After functional tests are ran, videos of browser UI interactions and failed test snapshots can be viewed at
`https://your-server-url.c0d3.com/functional` or `http://localhost:<port#>/functional`

#### Cypress Browser Mode
If working on local computer, tests can be ran in the chrome browser by following the below steps:

1.  Run express server `supervisor Server/app.js`
2.  Run webpack server `yarn start`
3.  Run cypress server `yarn run cypress:open`
4.  Navigate to cypress pop-up window and click on the specific test
5.  Watch/Interact with new chrome browser dedicated for functional testing

## Mattermost

#### Setup
1. Ask admin for mattermost access token and add it to .env file
2. Run express server `supervisor Server/app.js`
3. Run webpack server `yarn start`

#### Chatroom
1. Development `https://chat-dev.c0d3.com`
2. Production `https://chat.c0d3.com`

#### API Link
link `https://api.mattermost.com/#tag/users`

## Logging
The c0d3 codebase uses winston.js for application level logging.  In order to import the logger, use the following technique.

```javascript
const log = require('path/to/log')(__filename)

// use the following levels accordingly
log.error('log level 0 message')
log.warn('log level 1 message')
log.info('log level 2 message')
log.verbose('log level 3 message')
log.debug('log level 4 message')
log.silly('log level 5 message')
```
In production, only level 2 (i.e. info) and below will be logged.  In other environments, log level 4 (i.e. debug) and below will be displayed.


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
