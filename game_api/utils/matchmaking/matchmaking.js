const { Game } = require('../../models/game')
const { Deck } = require('../../models/deck')
const axios = require('axios')
const _ = require('lodash')
var playersToMatchmake = []

/**
 * Matchmake function which send socket signal to needed sockets and creates a game
 * @param {object} io server secured
 * @param {object} ioNotSecure server not secured
 * @param {string} gameType for settings
 * @param {number} moveTime for settings how long move will take
 * @param {number} turnLimit for settings how long will game take
 */
var matchmake = (io, ioNotSecure, gameType, moveTime, turnLimit) => {
    var playersToSort = playersToMatchmake
    playersToMatchmake = []
    playersToSort.sort((a, b) => {
        return a.userRating - b.userRating
    })

    for (let i = 1; i < playersToSort.length; i++) {
        if (playersToSort[i - 1].pared) {
            continue
        }

        if (!checkIfInRange(playersToSort[i - 1], playersToSort[i])) {
            continue
        }

        playersToSort[i - 1].pared = true
        playersToSort[i].pared = true
        if (io) {
            generateGame(playersToSort[i - 1], playersToSort[i], gameType, moveTime, turnLimit, io)
        } else {
            generateGame(playersToSort[i - 1], playersToSort[i], gameType, moveTime, turnLimit, ioNotSecure)
        }
    }

    for (let i = 0; i < playersToSort.length; i++) {
        if (!playersToSort[i].pared) {
            playersToMatchmake.push(playersToSort[i])
        }
    }

    playersToSort = []
}

/**
 * Checks if two players can be paired
 * @param {object} player1 
 * @param {object} player2 
 * @returns true if can pair them, false if not
 */
var checkIfInRange = (player1, player2) => {
    if (player1.userRating <= player2.userRating) {
        if (player1.userRating + (process.env.RATING_MODIFIER) / 1 >= player2.userRating) {
            if (player1.strength <= player2.strength) {
                return player1.strength + (process.env.STRENGTH_MODIFIER) / 1 >= player2.strength
            } else {
                return player2.strength + (process.env.STRENGTH_MODIFIER) / 1 >= player1.strength
            }
        }

        return false
    } else {
        if (player2.userRating + (process.env.RATING_MODIFIER) / 1 >= player1.userRating) {
            if (player1.strength <= player2.strength) {
                return player1.strength + (process.env.STRENGTH_MODIFIER) / 1 >= player2.strength
            } else {
                return player2.strength + (process.env.STRENGTH_MODIFIER) / 1 >= player1.strength
            }
        }

        return false
    }
}

/**
 * Redirects pared users to proper page
 * @param {object} io server
 * @param {string} id1 of socket
 * @param {string} id2 of socket
 * @param {string} target to where redirect
 */
var redirectSocketsTo = (io, id1, id2, target) => {
    io.in(id1).emit('gameCreated', target)
    io.in(id2).emit('gameCreated', target)
}

/**
 * Generates game
 * @param {object} player1 in game
 * @param {object} player2 in game
 * @param {string} gameType for settings
 * @param {number} moveTime for settings how long move will take
 * @param {number} turnLimit for settings how long will game take
 */
var generateGame = async (player1, player2, gameType, moveTime, turnLimit, io) => {
    var deck1 = undefined, deck2 = undefined, users = undefined
    if (player2.strength < player1.strength) {
        try {
            deck1 = await Deck.findOne({ _id: player2.userDeck, deleted: false })
            deck2 = await Deck.findOne({ _id: player1.userDeck, deleted: false })
        } catch (e) {
            redirectSocketsTo(io, player1.id, player2.id, '/cannotGenerateGame')
        }

        try {
            users = await axios.get(`${process.env.AUTH_SERVER}/get/usersToGame?player1=${player2.email}&player2=${player1.email}&gameApiSecret=${process.env.GAME_API_SECRET}`)
        } catch (e) {
            redirectSocketsTo(io, player1.id, player2.id, '/cannotGenerateGame')
        }
    } else {
        try {
            deck1 = await Deck.findOne({ _id: player1.userDeck, deleted: false })
            deck2 = await Deck.findOne({ _id: player2.userDeck, deleted: false })
        } catch (e) {
            redirectSocketsTo(io, player1.id, player2.id, '/cannotGenerateGame')
        }

        try {
            users = await axios.get(`${process.env.AUTH_SERVER}/get/usersToGame?player1=${player1.email}&player2=${player2.email}&gameApiSecret=${process.env.GAME_API_SECRET}`)
        } catch (e) {
            redirectSocketsTo(io, player1.id, player2.id, '/cannotGenerateGame')
        }

    }

    if (!deck1 || !deck2 || !users) {
        redirectSocketsTo(io, player1.id, player2.id, '/cannotGenerateGame')
    }

    if (!users.data) {
        redirectSocketsTo(io, player1.id, player2.id, '/cannotGenerateGame')
    }

    var player1 = {
        id: users.data.user1
    }
    var player2 = {
        id: users.data.user2
    }
    var player1Fog = {

    }
    var player2Fog = {

    }
    var map = {

    }
    var currentState = {

    }
    var history = [[{
        player1: player1Fog,
        player2: player2Fog,
        players: currentState
    }]]

    var newGame = new Game(_.pick({
        player1: player1,
        player2: player2,
        player1Fog: player1Fog,
        player2Fog: player2Fog,
        map: map,
        currentState: currentState,
        settings: {
            gameType: gameType,
            moveTime: moveTime,
            turnLimit: turnLimit
        },
        history: history,
        weakerPlayerChoosed: false,
        outcome: {
            winner: '',
            textOutcome: '',
            player1Points: 0,
            player1Funds: 0,
            player2Points: 0,
            player2Funds: 0
        },
        finished: false,
    }, ['player1', 'player2', 'player1Fog', 'player2Fog', 'map', 'currentState', 'settings', 'history', 'player1Starts', 'weakerPlayerChoosed', 'outcome', 'finished']))

    var returnedInfo = undefined
    try {
        returnedInfo = await newGame.save()
    } catch (e) {
        redirectSocketsTo(io, player1.id, player2.id, '/cannotGenerateGame')
    }

    if (!returnedInfo) {
        redirectSocketsTo(io, player1.id, player2.id, '/cannotGenerateGame')
    }

    if (returnedInfo._id) {
        redirectSocketsTo(io, player1.id, player2.id, `/game/${returnedInfo._id}`)
    }

    redirectSocketsTo(io, player1.id, player2.id, '/cannotGenerateGame')
}

/**
 * Adds player to the array of matchmaking players
 * @param {object} player 
 * @returns boolean if success
 */
var addPlayer = (player) => {
    for (let i = 0; i < playersToMatchmake.length; i++) {
        if (playersToMatchmake[i].id == player.id || playersToMatchmake[i].email == player.email) {
            return false
        }
    }
    playersToMatchmake.push(player)
    return true
}

/**
 * Removes player from the array of matchmaking players
 * @param {string} email 
 * @returns boolean if success
 */
var removePlayer = (email) => {
    for (let i = 0; i < playersToMatchmake.length; i++) {
        if (playersToMatchmake[i].email == email) {
            playersToMatchmake.splice(i, 1)
            return true
        }
    }
    return false
}

/**
 * Removes player from queue by socket id
 * @param {string} id to remove 
 * @returns boolean if success
 */
var removePlayerById = (id) => {
    for (let i = 0; i < playersToMatchmake.length; i++) {
        if (playersToMatchmake[i].id == id) {
            playersToMatchmake.splice(i, 1)
            return true
        }
    }
    return false
}

/**
 * Starts matchmaking system on the server
 * @param {object} io sockets
 * @param {object} ioNotSecure sockets
 * @param {string} gameType for settings
 * @param {number} moveTime for settings how long move will take
 * @param {number} turnLimit for settings how long will game take
 */
var startMatchmaking = (io, ioNotSecure, gameType, moveTime, turnLimit) => {
    setInterval(() => {
        matchmake(io, ioNotSecure, gameType, moveTime, turnLimit)
    }, process.env.MATCHMAKE_TIME_CHECK)
}

module.exports = { startMatchmaking, addPlayer, removePlayer, removePlayerById }

