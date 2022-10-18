var timeoutId, timeoutTime = 1000
$(document).ready(init())

/**
 * Adds event listener to input
 */
function init() {
    var name = document.getElementById('nation-name')
    if (name) {
        name.addEventListener('keyup', anythingChanged, false)
    }

    var description = document.getElementById('nation-description')
    if (description) {
        description.addEventListener('keyup', anythingChanged, false)
    }

    var mobility = document.getElementById('nation-mobility')
    if (mobility) {
        mobility.addEventListener('keyup', anythingChanged, false)
    }

    var defence = document.getElementById('nation-defence')
    if (defence) {
        defence.addEventListener('keyup', anythingChanged, false)
    }

    var attack = document.getElementById('nation-attack')
    if (attack) {
        attack.addEventListener('keyup', anythingChanged, false)
    }

    var readyToUse = document.getElementById('nation-ready')
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
    var putObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        name: $('#nation-name').val(),
        description: $('#nation-description').val(),
        id: $('#nation-id').val(),
        mobility: $('#nation-mobility').val(),
        defence: $('#nation-defence').val(),
        attack: $('#nation-attack').val(),
        readyToUse: $('#nation-ready').is(":checked")
    }
    var stringifiedObject = JSON.stringify(putObject)

    $.ajax({
        type: "PUT",
        data: stringifiedObject,
        url: '/put/admin/modify/nation',
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem("token", res.token)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
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