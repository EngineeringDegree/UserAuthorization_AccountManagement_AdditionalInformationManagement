var timeoutId, timeoutTime = 1000, savedConfigurations = [], currentIndex = 0, currentField = '', fields = [], choosingSpawnpoints = false
$(document).ready(init())

/**
 * Adds event listener to input
 */
function init() {
    getMapFields()
    let cardName = document.getElementById('map-name')
    if (cardName) {
        cardName.addEventListener('keyup', anythingChanged, false)
    }

    let size = document.getElementById('map-size')
    if (size) {
        let starting = document.getElementById('map-starting')
        let fields = document.getElementById('map-fields')
        if (starting && fields) {
            starting.addEventListener('change', anythingChanged, false)
            fields.addEventListener('change', anythingChanged, false)
            drawOverlay(size, starting.value, fields.value, true)
        }
        size.addEventListener('keyup', anythingChanged, false)
    }

    let image = document.getElementById('map-image')
    if (image) {
        image.addEventListener('keyup', anythingChanged, false)
    }

    let description = document.getElementById('map-description')
    if (description) {
        description.addEventListener('keyup', anythingChanged, false)
    }

    let readyToUse = document.getElementById('map-ready')
    if (readyToUse) {
        readyToUse.addEventListener('mousedown', anythingChanged, false)
    }
}

/** 
 * Send request on something changed after 1 second
 * @param {DOMElement} e event emitter
 */
function anythingChanged(e) {
    if (e.target.id == 'map-size') {
        drawOverlay(e)
    }

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
    const postObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        name: $('#map-name').val(),
        size: $('#map-size').val(),
        image: $('#map-image').val(),
        fields: savedConfigurations[currentIndex].fields,
        startingPositions: savedConfigurations[currentIndex].startingPositions,
        readyToUse: $('#map-ready').is(":checked"),
        id: $('#map-id').val(),
        description: $('#map-description').val()
    }
    const stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "PUT",
        data: stringifiedObject,
        url: '/put/admin/modify/map',
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