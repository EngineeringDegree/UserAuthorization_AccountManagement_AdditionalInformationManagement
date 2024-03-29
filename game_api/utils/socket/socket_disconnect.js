const { removePlayerBySocketId } = require('../matchmaking/matchmaking')

/**
 * Logic which handles disconnection of user from socketio server
 * @param {object} io whole io server 
 * @param {object} socket which lost connection/disconnected 
 */
const disconnect = (io, socket) => {
    removePlayerBySocketId(socket.id)
}

module.exports = disconnect