/**
 * Initialize websockets after page loads
 */
var socket
$(document).ready(init())

function init() {
    socket = io()
}