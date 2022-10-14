var timeoutId, timeoutTime = 1000
$(document).ready(init())

/**
 * Adds event listener to input
 */
function init() {
    var name = document.getElementById('effect-name')
    if (name) {
        name.addEventListener('keyup', anythingChanged, false)
    }

    var description = document.getElementById('effect-description')
    if (description) {
        description.addEventListener('keyup', anythingChanged, false)
    }

    var readyToUse = document.getElementById('effect-ready')
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
        name: $('#effect-name').val(),
        description: $('#effect-description').val(),
        id: $('#effect-id').val(),
        readyToUse: $('#effect-ready').is(":checked")
    }
    var stringifiedObject = JSON.stringify(putObject)

    $.ajax({
        type: "PUT",
        data: stringifiedObject,
        url: '/put/admin/modify/effect',
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