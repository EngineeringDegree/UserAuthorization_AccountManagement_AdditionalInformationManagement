// Imports without needed variable
require('dotenv').config()

// Imports with needed variable
const express = require('express')
const cors = require("cors")
const path = require('path')
const https = require('https')
const http = require('http')
const mongoose = require('mongoose')
const fs = require('fs')
const config = require('config')

// Get middleware
const checkIfLoggedIn = require('./api/get/user/checkIfLoggedIn')
const checkIfUserExists = require('./api/get/user/checkIfUserExists')
const getUsers = require('./api/get/user/getUsers')
const getUser = require('./api/get/user/getUser')
const authorizeAccount = require('./api/get/user/authorize')
const mainView = require('./api/get/views/index')
const error404View = require('./api/get/views/error404')
const changePasswordView = require('./api/get/views/changePasswordView')
const checkIfAdminLoggedIn = require('./api/get/admin/checkIfLoggedIn')
const checkIfHasAdminPremisions = require('./api/get/admin/checkIfUserHasAdminPremisions')
const isOwner = require('./api/get/user/isOwner')

// Patch middleware
const login = require('./api/patch/user/login')
const banUser = require('./api/patch/admin/banUser')
const changeUserUsername = require('./api/patch/user/changeUserUsername')
const askNewUserPassword = require('./api/patch/user/askNewUserPassword')
const changeUserEmail = require('./api/patch/user/changeUserEmail')
const changeUserAdmin = require('./api/patch/user/changeUserAdmin')
const changeUserConfirmed = require('./api/patch/user/changeUserConfirmed')
const changeUserPassword = require('./api/patch/user/changeUserPassword')
const buy = require('./api/patch/user/buy')
const refund = require('./api/patch/user/refund')

// Post middleware
const register = require('./api/post/user/register')

// Put middleware

// Express and socketio initialization for http and https requests
var app = express()

if (process.env.MODE == "live") {
    var server = https.createServer({
        key: fs.readFileSync(process.env.KEY, 'utf8'),
        cert: fs.readFileSync(process.env.CERT, 'utf8'),
        ca: fs.readFileSync(process.env.CA, 'utf8')
    }, app)
}

var serverNotSecure = http.createServer(app)

// Checking if private key of the server is present
if (!config.get('PrivateKey')) {
    console.error('FATAL ERROR: PrivateKey is not defined.')
    process.exit(1)
}

// Connect to database
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err))

// Use Cors and parse all requests to be a json string, use public folder as static files, set view engine to ejs   
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

// Routes

// Get
app.use('/', mainView)
app.use('/get/checkIfLoggedIn', checkIfLoggedIn)
app.use('/password/change', changePasswordView)
app.use('/get/admin/checkIfLoggedIn', checkIfAdminLoggedIn)
app.use('/get/admin/premisions', checkIfHasAdminPremisions)
app.use('/get/users', getUsers)
app.use('/get/user', getUser)
app.use('/get/user/exist', checkIfUserExists)
app.use('/authorize', authorizeAccount)
app.use('/get/user/isOwner', isOwner)

// Patch
app.use('/patch/login', login)
app.use('/patch/user/ban', banUser)
app.use('/patch/user/username', changeUserUsername)
app.use('/patch/user/email', changeUserEmail)
app.use('/patch/user/admin', changeUserAdmin)
app.use('/patch/user/confirmed', changeUserConfirmed)
app.use('/patch/user/askPassword', askNewUserPassword)
app.use('/patch/user/password', changeUserPassword)
app.use('/patch/user/funds', buy)
app.use('/patch/user/refund', refund)

// Post
app.use('/post/register', register)

// Put

// Other endpoints
app.use('*', error404View)

// Run servers

// HTTPS
if (process.env.MODE == "live") {
    const PORT = process.env.PORT
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}

//HTTP
const PORT_NOT_SECURE = process.env.PORT_NOT_SECURE
serverNotSecure.listen(PORT_NOT_SECURE, () => console.log(`Server running on port ${PORT_NOT_SECURE}`))