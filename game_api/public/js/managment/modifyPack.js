var timeoutId, timeoutTime = 1000
$(document).ready(init())

/**
 * Adds event listener to input
 */
function init() {
    var name = document.getElementById('pack-name')
    if (name) {
        name.addEventListener('keyup', anythingChanged, false)
    }

    var price = document.getElementById('pack-price')
    if (price) {
        price.addEventListener('keyup', anythingChanged, false)
    }

    var cardsCount = document.getElementById('pack-count')
    if (cardsCount) {
        cardsCount.addEventListener('keyup', anythingChanged, false)
    }

    var readyToUse = document.getElementById('pack-ready')
    if (readyToUse) {
        readyToUse.addEventListener('mousedown', anythingChanged, false)
    }
}

/** 
 * Send request on something changed after 1 second
 */
function anythingChanged() {
    if (timeoutId) {
        clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
        sendRequest()
    }, timeoutTime)
}

/**
 * Sends requests with user details and pack details to patch on backend
 */
function sendRequest() {
    var patchObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        name: $('#pack-name').val(),
        nation: $('#nation').val(),
        price: $('#pack-price').val(),
        id: $('#pack-id').val(),
        readyToUse: $('#pack-ready').is(":checked"),
        cardsCount: $('#pack-count').val()
    }
    var stringifiedObject = JSON.stringify(patchObject)

    $.ajax({
        type: "PUT",
        data: stringifiedObject,
        url: '/put/admin/modify/shopPack',
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem("token", res.token)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.responseJSON.action == "GO TO MAPS") {
                window.location.pathname = '/manage/map'
                return
            }

            if (xhr.responseJSON.action == "LOGOUT") {
                logOut()
                return
            }
        },
        dataType: "json",
        contentType: "application/json"
    })
}

function logOut() {
    window.localStorage.clear()
    window.location.pathname = "/logout"
}