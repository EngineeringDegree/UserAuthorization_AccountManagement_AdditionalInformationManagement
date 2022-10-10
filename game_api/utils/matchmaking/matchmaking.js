const matchmakeTimeCheck = 5000
var playersToMatchmake = []

/**
 * Matchmake function which send socket signal to needed sockets and creates a game
 * @param {object} io server secured
 * @param {object} ioNotSecure server not secured
 */
var matchmake = (io, ioNotSecure) => {
    console.log("Matchmaking", playersToMatchmake)
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
    }, matchmakeTimeCheck)
}

module.exports = { startMatchmaking, addPlayer, removePlayer, removePlayerById }

