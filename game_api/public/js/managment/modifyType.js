var timeoutId, timeoutTime = 1000
$(document).ready(init())

/**
 * Adds event listener to input
 */
function init() {
    let name = document.getElementById('type-name')
    if (name) {
        name.addEventListener('keyup', anythingChanged, false)
    }

    let description = document.getElementById('type-description')
    if (description) {
        description.addEventListener('keyup', anythingChanged, false)
    }

    let bna = document.getElementById('type-buff-nearby-allies')
    if (bna) {
        bna.addEventListener('keyup', anythingChanged, false)
    }

    let dne = document.getElementById('type-debuff-nearby-enemies')
    if (dne) {
        dne.addEventListener('keyup', anythingChanged, false)
    }

    let mobility = document.getElementById('type-mobility')
    if (mobility) {
        mobility.addEventListener('keyup', anythingChanged, false)
    }

    let defence = document.getElementById('type-defence')
    if (defence) {
        defence.addEventListener('keyup', anythingChanged, false)
    }

    let attack = document.getElementById('type-attack')
    if (attack) {
        attack.addEventListener('keyup', anythingChanged, false)
    }

    let vision = document.getElementById('type-vision')
    if (vision) {
        vision.addEventListener('keyup', anythingChanged, false)
    }

    let stun = document.getElementById('type-stun-immunity')
    if (stun) {
        stun.addEventListener('mousedown', anythingChanged, false)
    }

    let scare = document.getElementById('type-scare-immunity')
    if (scare) {
        scare.addEventListener('mousedown', anythingChanged, false)
    }

    let silence = document.getElementById('type-silence-immunity')
    if (silence) {
        silence.addEventListener('mousedown', anythingChanged, false)
    }

    let charge = document.getElementById('type-charge')
    if (charge) {
        charge.addEventListener('mousedown', anythingChanged, false)
    }

    let readyToUse = document.getElementById('type-ready')
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
    const putObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        name: $('#type-name').val(),
        description: $('#type-description').val(),
        id: $('#type-id').val(),
        buffNearbyAllies: $('#type-buff-nearby-allies').val(),
        debuffNearbyEnemies: $('#type-debuff-nearby-enemies').val(),
        mobility: $('#type-mobility').val(),
        defence: $('#type-defence').val(),
        attack: $('#type-attack').val(),
        vision: $('#type-vision').val(),
        stunImmunity: $('#type-stun-immunity').is(":checked"),
        scareImmunity: $('#type-scare-immunity').is(":checked"),
        silenceImmunity: $('#type-silence-immunity').is(":checked"),
        charge: $('#type-charge').is(":checked"),
        readyToUse: $('#type-ready').is(":checked")
    }
    const stringifiedObject = JSON.stringify(putObject)

    $.ajax({
        type: "PUT",
        data: stringifiedObject,
        url: '/put/admin/modify/type',
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