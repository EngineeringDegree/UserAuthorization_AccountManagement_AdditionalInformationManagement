// Imports without needed variable
require('dotenv').config()

// Imports with needed variable
const express = require('express')
const cors = require("cors")
const socketio = require('socket.io')
const https = require('https')
const http = require('http')
const mongoose = require('mongoose')
const fs = require('fs')
const config = require('config')
const { statuses } = require('./utils/enums/status')

// Own modules imports
const sockets = require('./api/sockets/sockets')
const { startMatchmaking } = require('./utils/matchmaking/matchmaking')

// Get middleware
const getMaps = require('./api/get/admin/getMaps')
const getCards = require('./api/get/admin/getCards')
const getFields = require('./api/get/admin/getFields')
const getNations = require('./api/get/admin/getNations')
const getEffects = require('./api/get/admin/getEffects')
const getTypes = require('./api/get/admin/getTypes')
const getShopPacks = require('./api/get/admin/getShopPacks')
const getUserDecks = require('./api/get/game/getDecks')
const getUserDeck = require('./api/get/game/getDeck')
const getUserCards = require('./api/get/game/getUserCards')
const getCardInfo = require('./api/get/game/getCardInfo')
const getUserCardsInfo = require('./api/get/game/getUserCardsInfo')
const getAllAssets = require('./api/get/admin/getAllAssets')
const getAllNations = require('./api/get/admin/getAllNations')
const getAllFields = require('./api/get/admin/getAllFields')
const getNamesOfNotReadyNations = require('./api/get/game/getNamesOfNotReadyNations')

// Patch middleware
const openPack = require('./api/patch/user/openPack')
const deleteDeck = require('./api/patch/user/deleteDeck')

// Post middleware
const addCard = require('./api/post/admin/addCard')
const addEffect = require('./api/post/admin/addEffect')
const addField = require('./api/post/admin/addField')
const addNation = require('./api/post/admin/addNation')
const addType = require('./api/post/admin/addType')
const addMap = require('./api/post/admin/addMap')
const addShopPack = require('./api/post/admin/addShopPack')
const addDeck = require('./api/post/user/addDeck')
const buyPack = require('./api/post/user/buyPack')
const findGame = require('./api/post/game/find')

// Put middleware
const modifyCard = require('./api/put/admin/modifyCard')
const modifyMap = require('./api/put/admin/modifyMap')
const modifyShopPack = require('./api/put/admin/modifyShopPack')
const modifyEffect = require('./api/put/admin/modifyEffect')
const modifyNation = require('./api/put/admin/modifyNation')
const modifyType = require('./api/put/admin/modifyType')
const modifyField = require('./api/put/admin/modifyField')
const editDeck = require('./api/put/user/editDeck')

// Delete middleware
const cancelSearch = require('./api/delete/game/cancel')
const deckSync = require('./api/delete/user/deckSync')
const cardSync = require('./api/delete/user/cardSync')

// Authorization middleware
const authorizeUser = require('./utils/auth/authorizeUser')
const authorizeAdmin = require('./utils/auth/authorizeAdmin')

// Express and socketio initialization for http and https requests
var app = express()
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

let io = socketio(server)

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

// Websocket endpoints initialization
sockets(io)

// Routes

// Get
app.use('/get/card', getCardInfo)
app.use('/get/cardById', require('./api/get/game/getCard'))
app.use('/get/effect', require('./api/get/game/getEffect'))
app.use('/get/nation', require('./api/get/game/getNation'))
app.use('/get/type', require('./api/get/game/getType'))
app.use('/get/field', require('./api/get/game/getField'))
app.use('/get/shopPack', require('./api/get/game/getShopPack'))
app.use('/manage/get/cards', authorizeAdmin, getCards)
app.use('/manage/get/maps', authorizeAdmin, getMaps)
app.use('/manage/get/nations', authorizeAdmin, getNations)
app.use('/manage/get/effects', authorizeAdmin, getEffects)
app.use('/manage/get/fields', authorizeAdmin, getFields)
app.use('/manage/get/types', authorizeAdmin, getTypes)
app.use('/manage/get/shopPacks', authorizeAdmin, getShopPacks)
app.use('/get/user/decks', authorizeUser, getUserDecks)
app.use('/get/user/deck', authorizeUser, getUserDeck)
app.use('/get/user/cards', authorizeUser, getUserCards)
app.use('/get/user/cards/info', authorizeUser, getUserCardsInfo)
app.use('/get/cardAssets/all', authorizeAdmin, getAllAssets)
app.use('/manage/get/nations/all', authorizeAdmin, getAllNations)
app.use('/manage/get/fields/all', authorizeAdmin, getAllFields)
app.use('/manage/get/nationsName/notReady', authorizeUser, getNamesOfNotReadyNations)

// Patch
app.use('/patch/user/packs', authorizeUser, openPack)
app.use('/decks/remove', authorizeUser, deleteDeck)

// Post
app.use('/post/admin/add/card', authorizeAdmin, addCard)
app.use('/post/admin/add/map', authorizeAdmin, addMap)
app.use('/post/admin/add/nation', authorizeAdmin, addNation)
app.use('/post/admin/add/effect', authorizeAdmin, addEffect)
app.use('/post/admin/add/field', authorizeAdmin, addField)
app.use('/post/admin/add/type', authorizeAdmin, addType)
app.use('/post/admin/add/shopPack', authorizeAdmin, addShopPack)
app.use('/post/deck/new', authorizeUser, addDeck)
app.use('/post/user/packs', authorizeUser, buyPack)
app.use('/find/game', authorizeUser, findGame)

// Put
app.use('/put/admin/modify/card', authorizeAdmin, modifyCard)
app.use('/put/admin/modify/map', authorizeAdmin, modifyMap)
app.use('/put/admin/modify/shopPack', authorizeAdmin, modifyShopPack)
app.use('/put/admin/modify/effect', authorizeAdmin, modifyEffect)
app.use('/put/admin/modify/nation', authorizeAdmin, modifyNation)
app.use('/put/admin/modify/type', authorizeAdmin, modifyType)
app.use('/put/admin/modify/field', authorizeAdmin, modifyField)
app.use('/put/deck/edit', authorizeUser, editDeck)

// Delete
app.use('/cancel/game', authorizeUser, cancelSearch)
app.use('/check/deck/sync', authorizeUser, deckSync)
app.use('/check/card/sync', authorizeUser, cardSync)

// Other endpoints
app.use('*', (req, res) => res.status(404).send({ status: statuses.NOT_FOUND, code: 404 }))

// Run matchmaking server
startMatchmaking(io, 'Ranked', 60000, 100)

// Run server
const PORT = process.env.PORT
server.listen(PORT, () => console.log(`Server running on port ${PORT}`))