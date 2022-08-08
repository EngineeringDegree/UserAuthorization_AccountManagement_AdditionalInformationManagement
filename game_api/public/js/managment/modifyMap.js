var timeoutId, timeoutTime = 1000
$(document).ready(init())

/**
 * Adds event listener to input
 */
function init() {
    var cardName = document.getElementById('map-name')
    if (cardName) {
        cardName.addEventListener('keyup', anythingChanged, false)
    }

    var size = document.getElementById('map-size')
    if (size) {
        size.addEventListener('keyup', anythingChanged, false)
    }

    var image = document.getElementById('map-image')
    if (image) {
        image.addEventListener('keyup', anythingChanged, false)
    }

    var fields = document.getElementById('map-fields')
    if (fields) {
        fields.addEventListener('keyup', anythingChanged, false)
    }

    var starting = document.getElementById('map-starting')
    if (starting) {
        starting.addEventListener('keyup', anythingChanged, false)
    }

    var description = document.getElementById('map-description')
    if (description) {
        description.addEventListener('keyup', anythingChanged, false)
    }

    var readyToUse = document.getElementById('map-ready')
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
 * Sends requests with user details and card details to patch on backend
 */
function sendRequest() {
    var postObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        name: $('#map-name').val(),
        size: $('#map-size').val(),
        image: $('#map-image').val(),
        fields: [$('#map-fields').val()],
        startingPositions: [$('#map-starting').val()],
        readyToUse: $('#map-ready').is(":checked"),
        id: $('#map-id').val(),
        description: $('#map-description').val()
    }
    var stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "PATCH",
        data: stringifiedObject,
        url: '/patch/admin/modify/map',
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