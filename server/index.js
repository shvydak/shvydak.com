const express = require('express')
const session = require('express-session')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcryptjs')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const compression = require('compression')
const morgan = require('morgan')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT

// Security middleware
app.use(
     helmet({
          contentSecurityPolicy: {
               directives: {
                    defaultSrc: ["'self'"],
                    styleSrc: [
                         "'self'",
                         "'unsafe-inline'",
                         'https://fonts.googleapis.com',
                         'https://cdnjs.cloudflare.com',
                    ],
                    fontSrc: [
                         "'self'",
                         'https://fonts.gstatic.com',
                         'https://cdnjs.cloudflare.com',
                    ],
                    scriptSrc: ["'self'", "'unsafe-inline'"],
                    imgSrc: ["'self'", 'data:', 'https:'],
                    connectSrc: ["'self'"],
               },
          },
     }),
)

// Rate limiting
const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
     message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

// Body parsing middleware
app.use(express.json({limit: '10mb'}))
app.use(express.urlencoded({extended: true, limit: '10mb'}))

// Compression middleware
app.use(compression())

// Logging middleware
app.use(morgan('combined'))

// CORS configuration
app.use(
     cors({
          origin:
               process.env.NODE_ENV === 'production'
                    ? ['https://shvydak.com', 'https://www.shvydak.com']
                    : ['http://localhost:3000'],
          credentials: true,
     }),
)

// Session configuration
app.use(
     session({
          secret:
               process.env.SESSION_SECRET ||
               'your-secret-key-change-in-production',
          resave: false,
          saveUninitialized: false,
          cookie: {
               secure: process.env.NODE_ENV === 'production',
               httpOnly: true,
               maxAge: 24 * 60 * 60 * 1000, // 24 hours
               sameSite:
                    process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          },
     }),
)

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// In-memory user store (in production, use a database)
const users = [
     {
          id: 1,
          username: 'admin',
          password: bcrypt.hashSync('admin123', 10),
          email: 'admin@shvydak.com',
          role: 'admin',
     },
]

// Passport Local Strategy
passport.use(
     new LocalStrategy(async (username, password, done) => {
          try {
               const user = users.find((u) => u.username === username)

               if (!user) {
                    return done(null, false, {message: 'Incorrect username.'})
               }

               const isValidPassword = await bcrypt.compare(
                    password,
                    user.password,
               )

               if (!isValidPassword) {
                    return done(null, false, {message: 'Incorrect password.'})
               }

               return done(null, user)
          } catch (error) {
               return done(error)
          }
     }),
)

// Passport serialization
passport.serializeUser((user, done) => {
     done(null, user.id)
})

passport.deserializeUser((id, done) => {
     const user = users.find((u) => u.id === id)
     done(null, user)
})

// Authentication middleware
const isAuthenticated = (req, res, next) => {
     if (req.isAuthenticated()) {
          return next()
     }
     res.status(401).json({message: 'Authentication required'})
}

// API Routes
app.get('/api/health', (req, res) => {
     res.json({
          status: 'OK',
          timestamp: new Date().toISOString(),
          environment: process.env.NODE_ENV || 'development',
     })
})

// Authentication routes
app.post('/api/auth/login', passport.authenticate('local'), (req, res) => {
     res.json({
          success: true,
          user: {
               id: req.user.id,
               username: req.user.username,
               email: req.user.email,
               role: req.user.role,
          },
     })
})

app.post('/api/auth/logout', (req, res) => {
     req.logout((err) => {
          if (err) {
               return res.status(500).json({message: 'Error during logout'})
          }
          res.json({success: true, message: 'Logged out successfully'})
     })
})

app.get('/api/auth/me', isAuthenticated, (req, res) => {
     res.json({
          user: {
               id: req.user.id,
               username: req.user.username,
               email: req.user.email,
               role: req.user.role,
          },
     })
})

// Protected route example
app.get('/api/dashboard', isAuthenticated, (req, res) => {
     res.json({
          message: 'Welcome to the dashboard!',
          user: req.user.username,
          services: [
               {
                    name: 'Immich Photos',
                    status: 'online',
                    url: 'http://photos.shvydak.com',
               },
               {
                    name: 'Portainer',
                    status: 'online',
                    url: 'http://portainer.shvydak.com',
               },
               {name: 'n8n', status: 'online', url: 'http://n8n.shvydak.com'},
               {
                    name: 'Home Assistant',
                    status: 'online',
                    url: 'http://homeassistant.shvydak.com',
               },
               {
                    name: 'Pi-hole',
                    status: 'online',
                    url: 'http://pihole.shvydak.com/admin',
               },
               {
                    name: 'Plex',
                    status: 'offline',
                    url: 'http://plex.shvydak.com',
               },
               {
                    name: 'Transmission',
                    status: 'offline',
                    url: 'http://torrents.shvydak.com',
               },
          ],
     })
})

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
     app.use(express.static(path.join(__dirname, '../client/build')))

     app.get('*', (req, res) => {
          res.sendFile(path.join(__dirname, '../client/build/index.html'))
     })
}

// Error handling middleware
app.use((err, req, res, next) => {
     console.error(err.stack)
     res.status(500).json({
          message: 'Something went wrong!',
          error:
               process.env.NODE_ENV === 'development'
                    ? err.message
                    : 'Internal server error',
     })
})

// 404 handler
app.use('*', (req, res) => {
     res.status(404).json({message: 'Route not found'})
})

app.listen(PORT, () => {
     console.log(`🚀 Server running on port ${PORT}`)
     console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
     console.log(`🔐 Authentication enabled`)
})
