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

    var mobility = document.getElementById('effect-mobility')
    if (mobility) {
        mobility.addEventListener('keyup', anythingChanged, false)
    }

    var defence = document.getElementById('effect-defence')
    if (defence) {
        defence.addEventListener('keyup', anythingChanged, false)
    }

    var attack = document.getElementById('effect-attack')
    if (attack) {
        attack.addEventListener('keyup', anythingChanged, false)
    }

    var canUseOn = document.getElementById('effect-can-use-on')
    if (canUseOn) {
        canUseOn.addEventListener('keyup', anythingChanged, false)
    }

    var cooldown = document.getElementById('effect-cooldown')
    if (cooldown) {
        cooldown.addEventListener('keyup', anythingChanged, false)
    }

    var duration = document.getElementById('effect-duration')
    if (duration) {
        duration.addEventListener('keyup', anythingChanged, false)
    }

    var cost = document.getElementById('effect-cost')
    if (cost) {
        cost.addEventListener('keyup', anythingChanged, false)
    }

    var stunImmunity = document.getElementById('effect-stun-immunity')
    if (stunImmunity) {
        stunImmunity.addEventListener('mousedown', anythingChanged, false)
    }

    var scareImmunity = document.getElementById('effect-scare-immunity')
    if (scareImmunity) {
        scareImmunity.addEventListener('mousedown', anythingChanged, false)
    }

    var silenceImmunity = document.getElementById('effect-silence-immunity')
    if (silenceImmunity) {
        silenceImmunity.addEventListener('mousedown', anythingChanged, false)
    }

    var stun = document.getElementById('effect-stun')
    if (stun) {
        stun.addEventListener('mousedown', anythingChanged, false)
    }

    var scare = document.getElementById('effect-scare')
    if (scare) {
        scare.addEventListener('mousedown', anythingChanged, false)
    }

    var silence = document.getElementById('effect-silence')
    if (silence) {
        silence.addEventListener('mousedown', anythingChanged, false)
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
        mobility: $('#effect-mobility').val(),
        defence: $('#effect-defence').val(),
        attack: $('#effect-attack').val(),
        canUseOn: $('#effect-can-use-on').val(),
        cooldown: $('#effect-cooldown').val(),
        duration: $('#effect-duration').val(),
        cost: $('#effect-cost').val(),
        stunImmunity: $('#effect-stun-immunity').is(":checked"),
        scareImmunity: $('#effect-scare-immunity').is(":checked"),
        silenceImmunity: $('#effect-silence-immunity').is(":checked"),
        stun: $('#effect-stun').is(":checked"),
        scare: $('#effect-scare').is(":checked"),
        silence: $('#effect-silence').is(":checked"),
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