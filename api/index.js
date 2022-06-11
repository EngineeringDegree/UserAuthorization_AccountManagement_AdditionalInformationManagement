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
const fs = require('fs')
const config = require('config')

// Own modules imports
const sockets = require('./api/sockets/sockets')

// Get middleware
const mainPageView = require('./api/get/user/mainPageView')
const signInView = require('./api/get/user/signInView')
const error404View = require('./api/get/user/error404View')
const logoutView = require('./api/get/user/logoutView')
const confirmAccountView = require('./api/get/user/confirmAccountView')
const registeredView = require('./api/get/user/registeredView')
const checkIfLoggedIn = require('./api/get/user/checkIfLoggedIn')
const profileView = require('./api/get/user/profileView')
const checkIfAdminLoggedIn = require('./api/get/admin/checkIfLoggedIn')
const manageView = require('./api/get/admin/manageView')
const manageCardView = require('./api/get/admin/manageCardView')
const manageMapView = require('./api/get/admin/manageMapView')
const getMaps = require('./api/get/admin/getMaps')
const getCards = require('./api/get/admin/getCards')

// Patch middleware
const login = require('./api/patch/user/login')

// Post middleware
const register = require('./api/post/user/register')

// Put middleware

// Express and socketio initialization for http and https requests
var app = express()

// Comment on the server this snippet and uncomment below one
var server = https.createServer({
    key: fs.readFileSync(process.env.KEY, 'utf8'),
    cert: fs.readFileSync(process.env.CERT, 'utf8'),
    ca: fs.readFileSync(process.env.CA, 'utf8')
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
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, { useNewUrlParser: true,  useUnifiedTopology: true})
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
app.use('/registered', registeredView)
app.use('/profile', profileView)
app.use('/manage', manageView)
app.use('/manage/card', manageCardView)
app.use('/manage/map', manageMapView)
app.use('/manage/get/cards', getCards)
app.use('/manage/get/maps', getMaps)
app.use('/get/checkIfLoggedIn', checkIfLoggedIn)
app.use('/get/admin/checkIfLoggedIn', checkIfAdminLoggedIn)

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