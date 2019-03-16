const log = require('./log')(__filename)
const config = require('../config.js')
const path = require('path')
const { User, sequelize } = require('./dbload.js')

const bcrypt = require('bcrypt')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const session = require('express-session')
const SequelizeStore = require('connect-session-sequelize')(session.Store)

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
const matterMostService = require('./auth/lib/matterMostService')
const gitLab = require('./auth/lib/helpers')

// Middleware to process requests
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// Logging Middleware
const networkLogger = require('./log/networkLogger')
app.use(networkLogger)

// View functional tests results easily
if (process.env.NODE_ENV !== 'production') {
  app.get('/deleteUser', (req, res) => {
    User.destroy({ where: {
      username: req.query.username
    } })
    res.send(req.query.username)
  })
  const functionalPath = path.join(__dirname, '../cypress')
  const serveIndex = require('serve-index')
  app.use('/functional', express.static(functionalPath), serveIndex(functionalPath, { icons: true }))
}

// By default, LocalStrategy expects to find credentials in parameters named username and password
passport.serializeUser((user, done) => {
  done(null, user)
})
passport.deserializeUser((user, done) => {
  done(null, user)
})
passport.use(new LocalStrategy(async (username, password, done) => {
  const user = await User.findOne({ where: { username } })
  if (!user) { return done(null, false) }
  const pwIsValid = await bcrypt.compare(password, user.password)
  if (!pwIsValid) { return done(null, false) }
  try {
    await gitLab.findOrCreate({ username, password, email: user.email, name: user.name })
    await matterMostService.signupUser(username, password, user.email)
  } catch (err) {
    console.log('err', err)
  }
  const userData = {
    id: user.dataValues.id,
    name: user.dataValues.name,
    username: user.dataValues.username,
    createdAt: user.dataValues.createdAt
  }
  return done(null, userData)
}))

app.use(session({
  secret: config.SESSION_SECRET,
  domain: config.HOST_NAME,
  store: new SequelizeStore({
    db: sequelize
  }),
  resave: false, // This is set to false because SequelizeStore supports touch method
  saveUninitialized: false // false is useful for implementing login sessions, reducing server storage usage
}))
app.use(passport.initialize())
app.use(passport.session()) // persistent login session

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
  context: ({ req }) => {
    return { user: req.user }
  }
})
apolloServer.applyMiddleware({
  app,
  cors: {
    origin: config.CLIENT_URL
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
app.post('/signin', passport.authenticate('local', {
  failureRedirect: '/signin'
}), (req, res) => {
  res.status(200).json({ success: true, userInfo: req.user })
})
app.post('/signup', authHelpers.postSignup, passport.authenticate('local', {
  failureRedirect: '/signup'
}), (req, res) => {
  res.status(200).json({ success: true, userInfo: req.user })
})
app.post('/validate', authHelpers.postValidate)
app.post('/password', authHelpers.postPassword) // untested
app.post('/clientForm', authHelpers.postClientForm) // untested
app.post('/names', authHelpers.postNames) // untested

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
const PORT = config.SERVER_PORT
server.listen(PORT, function () {
  log.info(`Server is listening on Port: ${PORT}`)
})
