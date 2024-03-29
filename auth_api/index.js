// Imports without needed variable
require('dotenv').config()

// Imports with needed variable
const express = require('express')
const cors = require("cors")
const https = require('https')
const http = require('http')
const mongoose = require('mongoose')
const fs = require('fs')
const config = require('config')
const { statuses } = require('./utils/enums/status')

// Get middleware
const checkIfLoggedIn = require('./api/get/user/checkIfLoggedIn')
const checkIfUserExists = require('./api/get/user/checkIfUserExists')
const getUsers = require('./api/get/user/getUsers')
const getUser = require('./api/get/user/getUser')
const checkIfAdminLoggedIn = require('./api/get/admin/checkIfLoggedIn')
const checkIfHasAdminPremisions = require('./api/get/admin/checkIfUserHasAdminPremisions')
const isOwner = require('./api/get/user/isOwner')
const usersToGame = require('./api/get/admin/usersToGame')

// Patch middleware
const authorizeAccount = require('./api/patch/user/authorize')
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
let app = express()
let server
if (process.env.MODE == "live") {
    server = https.createServer({
        key: fs.readFileSync(process.env.KEY, 'utf8'),
        cert: fs.readFileSync(process.env.CERT, 'utf8'),
        ca: fs.readFileSync(process.env.CA, 'utf8')
    }, app)
} else {
    server = http.createServer(app)
}

// Checking if private key of the server is present
if (!config.get('PrivateKey')) {
    console.error('FATAL ERROR: PrivateKey is not defined.')
    process.exit(1)
}

// Connect to database
mongoose.connect(process.env.DATABASE_CONNECTION_STRING, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Now connected to MongoDB!'))
    .catch(err => console.error('Something went wrong', err))

// Use Cors and parse all requests to be a json string
app.use(cors())
app.use(express.json())

// Routes

// Get
app.use('/get/checkIfLoggedIn', checkIfLoggedIn)
app.use('/get/admin/checkIfLoggedIn', checkIfAdminLoggedIn)
app.use('/get/admin/premisions', checkIfHasAdminPremisions)
app.use('/get/users', getUsers)
app.use('/get/user', getUser)
app.use('/get/user/exist', checkIfUserExists)
app.use('/get/user/isOwner', isOwner)
app.use('/get/usersToGame', usersToGame)

// Patch
app.use('/patch/authorize', authorizeAccount)
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
app.use('*', (req, res) => res.status(404).send({ status: statuses.NOT_FOUND, code: 404 }))

// Run server
const PORT = process.env.PORT
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
