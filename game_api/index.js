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
const mainPageView = require('./api/get/views/mainPageView')
const signInView = require('./api/get/views/signInView')
const error404View = require('./api/get/views/error404View')
const logoutView = require('./api/get/views/logoutView')
const registeredView = require('./api/get/views/registeredView')
const getUsersView = require('./api/get/views/getUsersView')
const getUserView = require('./api/get/views/getUserView')
const manageView = require('./api/get/views/manageView')
const manageCardView = require('./api/get/views/manageCardView')
const manageMapView = require('./api/get/views/manageMapView')
const addCardView = require('./api/get/views/addCardView')
const addMapView = require('./api/get/views/addMapView')
const modifyCardView = require('./api/get/views/modifyCardView')
const modifyMapView = require('./api/get/views/modifyMapView')
const playView = require('./api/get/views/playView')
const packsView = require('./api/get/views/packsView')
const shopView = require('./api/get/views/shopView')
const decksView = require('./api/get/views/decksView')
const getMaps = require('./api/get/admin/getMaps')
const getCards = require('./api/get/admin/getCards')
const getUserDecks = require('./api/get/game/getDecks')
const getUserDeck = require('./api/get/game/getDeck')
const getUserCards = require('./api/get/game/getUserCards')
const getCardInfo = require('./api/get/game/getCardInfo')

// Patch middleware
const modifyCard = require('./api/patch/admin/modifyCard')
const modifyMap = require('./api/patch/admin/modifyMap')
const openPack = require('./api/patch/user/openPack')

// Post middleware
const addCard = require('./api/post/admin/addCard')
const addMap = require('./api/post/admin/addMap')

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
var ioNotSecure = socketio(serverNotSecure)

if (process.env.MODE == "live") {
    var io = socketio(server)
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

// Use Cors and parse all requests to be a json string, use public folder as static files, set view engine to ejs   
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

// Websocket endpoints initialization
if (process.env.MODE == "live") {
    sockets(io)
}
sockets(ioNotSecure)

// Routes

// Get
app.use('/', mainPageView)
app.use('/play', playView)
app.use('/sign-in', signInView)
app.use('/logout', logoutView)
app.use('/registered', registeredView)
app.use('/manage', manageView)
app.use('/manage/card', manageCardView)
app.use('/manage/map', manageMapView)
app.use('/manage/card/add', addCardView)
app.use('/manage/map/add', addMapView)
app.use('/manage/card/modify', modifyCardView)
app.use('/manage/map/modify', modifyMapView)
app.use('/users', getUsersView)
app.use('/users/user', getUserView)
app.use('/packs', packsView)
app.use('/shop', shopView)
app.use('/decks', decksView)
app.use('/manage/get/cards', getCards)
app.use('/manage/get/maps', getMaps)
app.use('/get/user/decks', getUserDecks)
app.use('/get/user/deck', getUserDeck)
app.use('/get/user/cards', getUserCards)
app.use('/get/card', getCardInfo)

// Patch
app.use('/patch/admin/modify/card', modifyCard)
app.use('/patch/admin/modify/map', modifyMap)
app.use('/patch/user/packs', openPack)

// Post
app.use('/post/admin/add/card', addCard)
app.use('/post/admin/add/map', addMap)

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