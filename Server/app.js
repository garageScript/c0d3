if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

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
const session = {
  'name': 'session',
  'secret': process.env.SESSION_SECRET,
  'domain': process.env.HOST_NAME,
  'maxAge': 2592000000
}
app.use(cookieSession(session), (req, res, next) => {
  if (!req.session) req.session = {}
  req.user = req.session.userInfo || {}
  if (req.user.id) { req.user.id = parseInt(req.user.id, 10) }
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
    origin: process.env.CLIENT_URL
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
app.use(express.static(path.join(__dirname, '../build')))
app.use(express.static(path.join(__dirname, '../public')))

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

const noAuthRouter = (req, res) => {
  return res.sendFile(path.join(__dirname, '../public/root.html'))
}
app.get('/signup', noAuthRouter)
app.get('/signin', noAuthRouter)

app.get('/*', (req, res) => {
  if (req.user && req.user.id) { return res.sendFile(path.join(__dirname, '../public/root.html')) }
  return res.sendFile(path.join(__dirname, '../public/landing.html'))
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
