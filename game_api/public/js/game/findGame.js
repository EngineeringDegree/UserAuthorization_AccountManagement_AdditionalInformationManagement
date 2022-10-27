$(document).ready(init())

/**
 * Initializes find game frontend logic
 */
function init() {
    if (!socket) {
        alert('Websocket error. Try reloading the page.')
        return
    }

    socket.on('gameCreated', (pathname) => {
        window.location.pathname = pathname
    })

    $('#find-game').on('click', findGame)
}

/**
 * Initializes find game operation request to button
 */
function findGame() {
    const choosenUserDeck = $('#user-decks').val()
    if (!choosenUserDeck) {
        alert('Choose deck you want to play with. It can take a while to load up.')
        return
    }

    const postObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        socketId: socket.id,
        userDeck: choosenUserDeck
    }
    const stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "POST",
        data: stringifiedObject,
        url: '/find/game',
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem("token", res.token)
            }

            $('#user-decks').prop('disabled', 'disabled')
            $('#find-game').remove()
            $('#find-buttons').append(`<button id="cancel-game" class="btn own-btn">Cancel Search</button>`)
            $('#cancel-game').on('click', cancelGame)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.responseJSON.action == "REDIRECT TO MAIN SCREEN") {
                window.location.pathname = '/'
                return
            }

            if (xhr.responseJSON.action == "LOGOUT") {
                window.location.pathname = '/logout'
                return
            }

            alert('There was some error. Please try again later.')
        },
        dataType: "json",
        contentType: "application/json"
    })
}

function cancelGame() {
    const deleteObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken')
    }
    const stringifiedObject = JSON.stringify(deleteObject)

    $.ajax({
        type: "DELETE",
        data: stringifiedObject,
        url: '/cancel/game',
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem("token", res.token)
            }

            $('#user-decks').prop('disabled', false)
            $('#cancel-game').remove()
            $('#find-buttons').append(`<button id="find-game" class="btn own-btn">Find Game</button>`)
            $('#find-game').on('click', findGame)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.responseJSON.action == "REDIRECT TO MAIN SCREEN") {
                window.location.pathname = '/'
                return
            }

            if (xhr.responseJSON.action == "LOGOUT") {
                window.location.pathname = '/logout'
                return
            }

            alert('Cannot cancel game. Please try again.')
        },
        dataType: "json",
        contentType: "application/json"
    })
}