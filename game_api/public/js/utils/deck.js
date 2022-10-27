/**
 * Generates random string from letters and numbers
 * @param {number} length how long string should be
 * @returns random string with length of parameter
 */
function makeid(length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

/**
 * Send request to add new deck to user account
 * @param {object} deck of deck to add 
 */
function addDeck(deck) {
    const postObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        name: deck.name,
        nation: deck.nation,
        cards: deck.cards.cardsPrepared
    }
    const stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "POST",
        url: `/post/deck/new`,
        data: stringifiedObject,
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem('token', res.token)
            }

            alert('Deck saved, page will be reloaded.')
            window.location.reload()
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.responseJSON.action == "LOGOUT") {
                window.location.pathname = '/logout'
                return
            }

            alert("something went wrong")
        },
        dataType: "json",
        contentType: "application/json"
    })
}

/**
 * Sends request to change deck on backend
 * @param {object} deck of deck to change 
 */
function editDeck(deck) {
    const patchObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        name: deck.name,
        cards: deck.cards.cardsPrepared,
        id: deck.id
    }
    const stringifiedObject = JSON.stringify(patchObject)

    $.ajax({
        type: "PUT",
        url: `/put/deck/edit`,
        data: stringifiedObject,
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem('token', res.token)
            }

            alert('Deck saved, to edit further just continue.')
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.responseJSON.action == "LOGOUT") {
                logOut()
                return
            }

            alert("something went wrong")
        },
        dataType: "json",
        contentType: "application/json"
    })
}