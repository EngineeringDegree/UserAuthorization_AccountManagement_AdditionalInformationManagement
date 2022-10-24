$(document).ready(init())

function init() {
    var sync = document.getElementById('sync-check')
    if (sync) {
        sync.addEventListener('click', syncCards, false)
    }
}

function syncCards() {
    if (typeof deck !== 'undefined') {
        let deleteObject = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            deck: deck
        }

        let stringifiedObject = JSON.stringify(deleteObject)
        $.ajax({
            type: "DELETE",
            data: stringifiedObject,
            url: `/check/deck/sync`,
            success: function (res) {
                if (res.token) {
                    window.localStorage.setItem("token", res.token)
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.responseJSON.action == "LOGOUT") {
                    window.location.pathname = 'logout'
                    return
                }

                if (xhr.responseJSON.action == "RELOAD") {
                    window.location.reload()
                    return
                }
            },
            dataType: "json",
            contentType: "application/json"
        })
        return
    }

    let deleteObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        deck: currentDecksByNations[currentDeck]
    }

    let stringifiedObject = JSON.stringify(deleteObject)

    $.ajax({
        type: "DELETE",
        data: stringifiedObject,
        url: `/check/card/sync`,
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem("token", res.token)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.responseJSON.action == "LOGOUT") {
                window.location.pathname = 'logout'
                return
            }
            if (xhr.responseJSON.action == "RELOAD") {
                window.location.reload()
                return
            }
        },
        dataType: "json",
        contentType: "application/json"
    })
}