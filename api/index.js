// Imports without needed variable
require('dotenv').config()

// Imports with needed variable
const express = require('express')
const cors = require("cors")
const socketio = require('socket.io')
const path = require('path')
const https = require('https')
const http = require('http')
const mongoose = require('mongoose')
const config = require('config')

// Own modules imports
const sockets = require('./api/sockets/sockets')

// Get middleware
const mainPageView = require('./api/get/mainPageView')
const signInView = require('./api/get/signInView')
const error404View = require('./api/get/error404View')
const logoutView = require('./api/get/logoutView')
const confirmAccountView = require('./api/get/confirmAccountView')
const checkIfLoggedIn = require('./api/get/checkIfLoggedIn')

// Patch middleware
const login = require('./api/patch/login')

// Post middleware
const register = require('./api/post/register')

// Express and socketio initialization for http and https requests
var app = express()
var server = https.createServer({
    key: '',
    cert: '',
    ca: ''
}, app)
var serverNotSecure = http.createServer(app)
var ioNotSecure = socketio(serverNotSecure)
var io = socketio(server)

// Checking if private key of the server is present
if (!config.get('PrivateKey')) {
    console.error('FATAL ERROR: PrivateKey is not defined.')
    process.exit(1)
}

// Connect to database
mongoose.connect(`mongodb://localhost/${process.env.DATABASE_NAME}`, { useNewUrlParser: true,  useUnifiedTopology: true})
.then(() => console.log('Now connected to MongoDB!'))
.catch(err => console.error('Something went wrong', err))

// Use Cors and parse all requests to be a json string, use public folder as static files, set view engine to ejs   
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

// Websocket endpoints initialization
sockets(io)
sockets(ioNotSecure)

// Routes

// Get
app.use('/', mainPageView)
app.use('/sign-in', signInView)
app.use('/logout', logoutView)
app.use('/authorize', confirmAccountView)
app.use('/get/checkIfLoggedIn', checkIfLoggedIn)

// Patch
app.use('/patch/login', login)

// Post
app.use('/post/register', register)

// Put

// Other endpoints
app.use('*', error404View)

// Run servers

// HTTPS
const PORT = process.env.PORT
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

//HTTP
const PORT_NOT_SECURE = process.env.PORT_NOT_SECURE
serverNotSecure.listen(PORT_NOT_SECURE, () => console.log(`Server running on port ${PORT_NOT_SECURE}`))