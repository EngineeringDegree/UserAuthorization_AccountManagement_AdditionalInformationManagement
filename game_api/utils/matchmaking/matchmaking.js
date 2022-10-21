const { Game } = require('../../models/game')
const _ = require('lodash')
var playersToMatchmake = []

/**
 * Matchmake function which send socket signal to needed sockets and creates a game
 * @param {object} io server secured
 * @param {object} ioNotSecure server not secured
 */
var matchmake = async (io, ioNotSecure) => {
    var playersToSort = playersToMatchmake
    playersToMatchmake = []
    playersToSort.sort((a, b) => {
        return a.userRating - b.userRating
    })

    for (let i = 1; i < playersToSort.length; i++) {
        if (playersToSort[i - 1].userRating + process.env.RATING_MODIFIER >= playersToSort[i].userRating && (!playersToSort[i - 1].pared && !playersToSort[i - 1].pared)) {
            if (playersToSort[i - 1].strength < playersToSort[i].strength) {
                if (playersToSort[i - 1].strength + process.env.STRENGTH_MODIFIER >= playersToSort[i].strength) {
                    playersToSort[i - 1].pared = true
                    playersToSort[i].pared = true
                    if (io) {
                        let id = await generateGame(playersToSort[i - 1], playersToSort[i])
                        io.in(playersToSort[i - 1].id).emit('gameCreated', id)
                        io.in(playersToSort[i].id).emit('gameCreated', id)
                    } else {
                        let id = await generateGame(playersToSort[i - 1], playersToSort[i])
                        ioNotSecure.in(playersToSort[i - 1].id).emit('gameCreated', id)
                        ioNotSecure.in(playersToSort[i].id).emit('gameCreated', id)
                    }
                }
            } else if (playersToSort[i - 1].strength > playersToSort[i].strength) {
                if (playersToSort[i].strength + process.env.STRENGTH_MODIFIER >= playersToSort[i - 1].strength) {
                    playersToSort[i - 1].pared = true
                    playersToSort[i].pared = true
                    if (io) {
                        let id = await generateGame(playersToSort[i - 1], playersToSort[i])
                        io.in(playersToSort[i - 1].id).emit('gameCreated', id)
                        io.in(playersToSort[i].id).emit('gameCreated', id)
                    } else {
                        let id = await generateGame(playersToSort[i - 1], playersToSort[i])
                        ioNotSecure.in(playersToSort[i - 1].id).emit('gameCreated', id)
                        ioNotSecure.in(playersToSort[i].id).emit('gameCreated', id)
                    }
                }
            } else if (playersToSort[i - 1].strength == playersToSort[i].strength) {
                playersToSort[i - 1].pared = true
                playersToSort[i].pared = true
                if (io) {
                    let id = await generateGame(playersToSort[i - 1], playersToSort[i])
                    io.in(playersToSort[i - 1].id).emit('gameCreated', id)
                    io.in(playersToSort[i].id).emit('gameCreated', id)
                } else {
                    let id = await generateGame(playersToSort[i - 1], playersToSort[i])
                    ioNotSecure.in(playersToSort[i - 1].id).emit('gameCreated', id)
                    ioNotSecure.in(playersToSort[i].id).emit('gameCreated', id)
                }
            }
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
 * Generates game
 * @param {object} player1 in game
 * @param {object} player2 in game
 */
var generateGame = async (player1, player2) => {
    var newGame = new Game(_.pick({
        player1: {},
        player2: {},
        map: {},
        currentState: {},
        settings: {},
        history: [],
        player1Starts: true,
        weakerPlayerChoosed: false,
        outcome: {},
        finished: false,
    }, ['player1', 'player2', 'map', 'currentState', 'settings', 'history', 'player1Starts', 'weakerPlayerChoosed', 'outcome', 'finished']))
    var returnedInfo = await newGame.save()
    if (returnedInfo._id) {
        return `/game/${returnedInfo._id}`
    }

    return '/cannotGenerateGame'
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
 */
var startMatchmaking = (io, ioNotSecure) => {
    setInterval(() => {
        matchmake(io, ioNotSecure)
    }, process.env.MATCHMAKE_TIME_CHECK)
}

module.exports = { startMatchmaking, addPlayer, removePlayer, removePlayerById }

