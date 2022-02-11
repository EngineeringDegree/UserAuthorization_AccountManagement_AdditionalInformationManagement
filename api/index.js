// Imports without needed variable
require('dotenv').config()

// Imports with needed variable
const express = require('express')
const cors = require("cors")
const socketio = require('socket.io')
const https = require('https')
const http = require('http')
const mongoose = require('mongoose')
const config = require('config')

// Own modules imports
const sockets = require('./api/sockets/sockets')

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
mongoose.connect('mongodb://localhost/MythWars', { useNewUrlParser: true,  useUnifiedTopology: true})
.then(() => console.log('Now connected to MongoDB!'))
.catch(err => console.error('Something went wrong', err))

// Use Cors and parse all requests to be a json string
app.use(cors())
app.use(express.json())

// Websocket endpoints initialization
sockets(io)
sockets(ioNotSecure)

// Run servers

// HTTPS
const PORT = process.env.PORT
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

//HTTP
const PORT_NOT_SECURE = process.env.PORT_NOT_SECURE
serverNotSecure.listen(PORT_NOT_SECURE, () => console.log(`Server running on port ${PORT_NOT_SECURE}`))