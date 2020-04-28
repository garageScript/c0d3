const log = require('./log')(__filename)
const config = require('../config.js')
const path = require('path')
const { User, sequelize, Lesson, Challenge } = require('./dbload.js')

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

const authHelpers = require('./auth/app')
const pushNotification = require('./lib/pushNotification')
const gitTrackerHelper = require('./gitTracker/gitTracker')
const matterMostService = require('./auth/lib/matterMostService')
const gitLab = require('./auth/lib/helpers')
const nanoid = require('nanoid')

app.get('/', (req, res) => {
  return res.redirect('https://www.c0d3.com')
})

const stats = {}
app.get('/stats', (req, res) => {
  return res.json(stats)
})

app.use('/*', (req, res, next) => {
  try{
    const pathStat = stats[req.path] || []
    pathStat.push(Date.now())
    stats[req.path] = pathStat
  } catch(e) {
    console.log('error detected', e)
  }
  return next()
})

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
    log.info(`Before Signin`)
    const gitLabUser = await gitLab.findOrCreate({ username, password, email: user.email, name: user.name })
    log.info(`Signin for gitlab successful: ${gitLabUser}`)
    const mattermostUser = await matterMostService.signupUser(username, password, user.email)
    log.info(`Signin for mattermost successful: ${mattermostUser}`)
  } catch (err) {
    log.error(`Signin for mattermost or gitlab failed: ${err}`)
    console.log('err', err)
  }
  const userData = {
    id: user.dataValues.id,
    name: user.dataValues.name,
    username: user.dataValues.username,
    createdAt: user.dataValues.createdAt,
    isAdmin: user.dataValues.isAdmin,
    emailVerificationToken: user.emailVerificationToken
  }
  if (password.length < 8) {
    userData.mustReset = true
  }
  return done(null, userData)
}))

app.post('/cli/signin', async (req, res) => {
  const { username, password } = req.body
  try {
    const user = await User.findOne({ where: { username } })
    const pwIsValid = await bcrypt.compare(password, user.password)
    if (!pwIsValid) throw new Error('Password does not match')
    let cliToken = user.cliToken
    if (!cliToken) {
      cliToken = nanoid()
      await user.update({ cliToken })
    }
    res.json({ username, cliToken })
    log.info(`Signin to CLI successful: ${username}`)
  } catch (error) {
    log.error(`Signin to CLI failed: ${error}`)
    res.status(403).json({ username, error })
  }
})

app.set('trust proxy', 1) // Source: https://github.com/expressjs/session#cookie-options
app.use(session({
  secret: config.SESSION_SECRET,
  domain: config.HOST_NAME,
  store: new SequelizeStore({
    db: sequelize
  }),
  resave: false, // This is set to false because SequelizeStore supports touch method
  saveUninitialized: false, // false is useful for implementing login sessions, reducing server storage usage
  cookie: {sameSite: 'none', secure: true} // secure must always be true for sameSite none
}))

// For CORS. Must be placed at the top so this handles
// cors request first before propagating to other middlewares
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST') // cors preflight
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Credentials'
  )
  next()
})
app.use(passport.initialize())
app.use(passport.session()) // persistent login session

const apolloServer = new ApolloServer({
  schema: gqlSchema,
  context: ({ req }) => {
    return { user: req.user }
  }
})
apolloServer.applyMiddleware({
  app,
  cors: {
    credentials: true,
    origin: (origin, cb) => {
      // Hard to find documentation on this.
      //   Source: https://github.com/apollographql/apollo-server/issues/1142#issuecomment-584790781
      const whitelist = [
        'https://c0d3.com',
        'https://www.c0d3.com',
        'https://v2.c0d3.app',
        config.CLIENT_URL,
      ]

      // Development should allow all domains to access graphql
      if (process.env.NODE_ENV !== 'production') {
        return cb(null, true)
      }
      // Bug 2/29/2020: All submissions broke.
      // CLI submission have no origins, so origin will be undefined.
      //   Therefore, In addition to allowing domains, we must also check for
      //   cases wher origin is undefined
      if (whitelist.includes(origin) || !origin) {
        return cb(null, true)
      }
      return cb(new Error('Not allowed by cors'))
    }
  }
})

const drawRoutes = require('./draw/draw')
const solution = require('./solution')

app.get('/book', (req, res) => {
  res.redirect('https://www.notion.so/garagescript/Table-of-Contents-a83980f81560429faca3821a9af8a5e2')
})

app.use('/apis/draw', drawRoutes)
app.get('/api/lessons', (req, res) => {
  Lesson.findAll({
    include: [{
      model: Challenge
    }],
    order: [ ['order', 'ASC'], [Challenge, 'order', 'ASC']]
  }).then((results) => {
    res.json(results)
  })
})
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
  return res.sendFile(path.join(__dirname, '../public/index.html'))
}
app.get('/signup', noAuthRouter)
app.get('/signin', noAuthRouter)
app.get('/resetpassword/:token', noAuthRouter)
app.get('/confirmEmail/:token', authHelpers.confirmEmail)
app.get('/verifySubmissionToken', async (req, res) => {
  try {
    const token = req.query.token
    const user = await User.findOne({ where: { cliToken: token } })
    return res.json({ userId: user.id })
  } catch (e) {
    return res.json({ userId: false })
  }
})

// Process Waitlist request
app.post('/waitlist', (req, res) => {
  authHelpers.joinWaitList(req, res)
} )

app.get('/*', (req, res) => {
  return res.sendFile(path.join(__dirname, '../public/index.html'))
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
