var timeoutId, timeoutTime = 1000
$(document).ready(init())

/**
 * Adds event listener to input
 */
function init() {
    var name = document.getElementById('field-name')
    if (name) {
        name.addEventListener('keyup', anythingChanged, false)
    }

    var description = document.getElementById('field-description')
    if (description) {
        description.addEventListener('keyup', anythingChanged, false)
    }

    var readyToUse = document.getElementById('field-ready')
    if (readyToUse) {
        readyToUse.addEventListener('mousedown', anythingChanged, false)
    }

    var basicDefence = document.getElementById('basic-defence')
    if (basicDefence) {
        basicDefence.addEventListener('keyup', anythingChanged, false)
    }

    var basicMobilityCost = document.getElementById('basic-mobility-cost')
    if (basicMobilityCost) {
        basicMobilityCost.addEventListener('keyup', anythingChanged, false)
    }

    var visionCost = document.getElementById('vision-cost')
    if (visionCost) {
        visionCost.addEventListener('keyup', anythingChanged, false)
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
        name: $('#field-name').val(),
        description: $('#field-description').val(),
        basicDefence: $('#basic-defence').val(),
        basicMobilityCost: $('#basic-mobility-cost').val(),
        visionCost: $('#vision-cost').val(),
        id: $('#field-id').val(),
        readyToUse: $('#field-ready').is(":checked")
    }
    var stringifiedObject = JSON.stringify(putObject)

    $.ajax({
        type: "PUT",
        data: stringifiedObject,
        url: '/put/admin/modify/field',
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