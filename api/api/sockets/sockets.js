/**
 * Function which contains endpoints logic for websockets
 * @param {socket object} io - contains websocket server initialization 
 */
var sockets = (io) => {
    /**
     * Fires on connection of socket
     */
    io.on('connection', (socket) => {
        /**
         * Fires when socket disconnects
         */
        socket.on('disconnecting', () => {
            
        })
    })
}

module.exports = sockets