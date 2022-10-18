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
const { checkIfUrlNeedsSockets } = require('./utils/socket/socket_checkIfUrlNeedSocket')
const { startMatchmaking } = require('./utils/matchmaking/matchmaking')

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
const addShopPackView = require('./api/get/views/addShopPackView')
const modifyCardView = require('./api/get/views/modifyCardView')
const modifyMapView = require('./api/get/views/modifyMapView')
const playView = require('./api/get/views/playView')
const packsView = require('./api/get/views/packsView')
const shopView = require('./api/get/views/shopView')
const decksView = require('./api/get/views/decksView')
const deckEditView = require('./api/get/views/deckEditView')
const deckAddView = require('./api/get/views/deckAddView')
const manageShopPacksView = require('./api/get/views/manageShopPacksView')
const shopPackModifyView = require('./api/get/views/modifyShopPackView')
const effectView = require('./api/get/views/manageEffectView')
const nationView = require('./api/get/views/manageNationView')
const typeView = require('./api/get/views/manageTypeView')
const fieldView = require('./api/get/views/manageFieldsView')
const addTypeView = require('./api/get/views/addTypeView')
const addNationView = require('./api/get/views/addNationView')
const addEffectView = require('./api/get/views/addEffectView')
const addFieldView = require('./api/get/views/addFieldView')
const modifyNationView = require('./api/get/views/modifyNationView')
const modifyEffectView = require('./api/get/views/modifyEffectView')
const modifyTypeView = require('./api/get/views/modifyTypeView')
const modifyFieldView = require('./api/get/views/modifyFieldView')
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

// Authorization middleware
const authorizeUser = require('./utils/auth/authorizeUser')
const authorizeAdmin = require('./utils/auth/authorizeAdmin')

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
app.use(function (req, res, next) {
    var originalUrl = req.originalUrl.split('?')
    if (originalUrl.length > 0) {
        if (checkIfUrlNeedsSockets(originalUrl[0])) {
            if (process.env.MODE == "live") {
                res.locals.io = io
            }

            res.locals.ioNotSecure = ioNotSecure
        }
    }

    next()
})

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
app.use('/manage/nations/add', addNationView)
app.use('/manage/effects/add', addEffectView)
app.use('/manage/field/add', addFieldView)
app.use('/manage/types/add', addTypeView)
app.use('/manage/shopPacks/add', addShopPackView)
app.use('/manage/card/modify', modifyCardView)
app.use('/manage/map/modify', modifyMapView)
app.use('/manage/nation/modify', modifyNationView)
app.use('/manage/type/modify', modifyTypeView)
app.use('/manage/field/modify', modifyFieldView)
app.use('/manage/effect/modify', modifyEffectView)
app.use('/users', getUsersView)
app.use('/users/user', getUserView)
app.use('/packs', packsView)
app.use('/shop', shopView)
app.use('/decks', decksView)
app.use('/decks/new', deckAddView)
app.use('/decks/edit', deckEditView)
app.use('/manage/shopPacks', manageShopPacksView)
app.use('/manage/shopPack/modify', shopPackModifyView)
app.use('/manage/fields', fieldView)
app.use('/manage/effects', effectView)
app.use('/manage/nations', nationView)
app.use('/manage/types', typeView)
app.use('/get/card', getCardInfo)
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

// Other endpoints
app.use('*', error404View)

// Run matchmaking server
startMatchmaking(io, ioNotSecure)

// HTTPS
if (process.env.MODE == "live") {
    const PORT = process.env.PORT
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}
//HTTP
const PORT_NOT_SECURE = process.env.PORT_NOT_SECURE
serverNotSecure.listen(PORT_NOT_SECURE, () => console.log(`Server running on port ${PORT_NOT_SECURE}`))