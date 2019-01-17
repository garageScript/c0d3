if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

// Configuration imports
const { session } = require(`./config.json`)
const path = require('path')

// Imports for requests
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')

// Imports for Apollo Graphql
const { ApolloServer } = require('apollo-server-express')
const gqlSchema = require('./graphql/index')

// Server Init and Server Wrapping for Sockets
const express = require('express')
const app = express()
const server = require('http').Server(app)
const realtime = require('./chat/socket')
realtime.init(server)

const authHelpers = require('./auth/app')
const pushNotification = require('./lib/pushNotification')
const gitTrackerHelper = require('./gitTracker/gitTracker')

// Middleware to process requests
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// Middleware to set session cookies
app.use(cookieSession(session), (req, res, next) => {
  req.user = req.session.userInfo || {}
  req.user.id = parseInt(req.user.id, 10)
  next()
})

// For CORS. Must be placed at the top so this handles
// cors request first before propagating to other middlewares
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'PUT, POST') // cors preflight
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  )
  next()
})

const apolloServer = new ApolloServer({
  schema: gqlSchema,
  context: ({ req }) => ({ user: req.user })
})
apolloServer.applyMiddleware({
  app,
  cors: {
    origin: 'https://song.c0d3.com' // TODO: Make it part of env
  }
})

const drawRoutes = require('./draw/draw')
const solution = require('./solution')
app.use('/apis/draw', drawRoutes)
app.use('/solution', solution)

// Mobile
app.post('/mobile-push-tokens', (req, res) => {
  pushNotification.addTokens(req.body)
  res.send(200)
})

// Static content
app.use(express.static(path.join(__dirname, '../../c0d3/build')))
app.use(express.static(path.join(__dirname, '../../c0d3/public')))

// Profile gitlab tracker
app.post('/profile/merge_requests', gitTrackerHelper.getMergeRequests)

// Authentication
app.get('/session', authHelpers.getSession)
app.get('/signout', authHelpers.getSignout)
app.get('/usernames/:username', authHelpers.getUsername)
app.post('/signin', authHelpers.postSignin)
app.post('/validate', authHelpers.postValidate)
app.post('/password', authHelpers.postPassword) // untested
app.post('/clientForm', authHelpers.postClientForm) // untested
app.post('/names', authHelpers.postNames) // untested
app.post('/signup', authHelpers.postSignup)

app.get('/ios', (req, res) => {
  return res.redirect('https://testflight.apple.com/join/B8wZp83I')
})

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../c0d3/public/index.html'))
})

// Send 404 to non-existing routes
app.get('*', (req, res) => {
  res.status(404).send('404 not found')
})

// Configure ports
const PORT = process.env.SERVER_PORT
server.listen(PORT, function () {
  console.log(`Server is listening on Port: ${PORT}`)
})
