var timeoutId, timeoutTime = 1000
$(document).ready(init())

/**
 * Adds event listener to input
 */
function init() {
    let cardName = document.getElementById('card-name')
    if (cardName) {
        cardName.addEventListener('keyup', anythingChanged, false)
    }

    let image = document.getElementById('card-image')
    if (image) {
        image.addEventListener('keyup', anythingChanged, false)
    }

    let type = document.getElementById('card-type')
    if (type) {
        type.addEventListener('keyup', anythingChanged, false)
    }

    let nation = document.getElementById('card-nation')
    if (nation) {
        nation.addEventListener('keyup', anythingChanged, false)
    }

    let resources = document.getElementById('card-resources')
    if (resources) {
        resources.addEventListener('keyup', anythingChanged, false)
    }

    let attack = document.getElementById('card-attack')
    if (attack) {
        attack.addEventListener('keyup', anythingChanged, false)
    }

    let defense = document.getElementById('card-defense')
    if (defense) {
        defense.addEventListener('keyup', anythingChanged, false)
    }

    let mobility = document.getElementById('card-mobility')
    if (mobility) {
        mobility.addEventListener('keyup', anythingChanged, false)
    }

    let vision = document.getElementById('card-vision')
    if (vision) {
        vision.addEventListener('keyup', anythingChanged, false)
    }

    let effects = document.getElementById('card-effects')
    if (effects) {
        effects.addEventListener('keyup', anythingChanged, false)
    }

    let description = document.getElementById('card-description')
    if (description) {
        description.addEventListener('keyup', anythingChanged, false)
    }

    let readyToUse = document.getElementById('card-ready')
    if (readyToUse) {
        readyToUse.addEventListener('change', anythingChanged, false)
    }

    let basicDeck = document.getElementById('card-basic-deck')
    if (basicDeck) {
        basicDeck.addEventListener('keyup', anythingChanged, false)
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
    const types = $("#types :input")
    const nations = $("#nations :input")
    const effects = $("#effects :input")

    let type = []
    let nation = []
    let effect = []

    for (let i = 0; i < types.length; i++) {
        if (types[i].checked == true) {
            type.push(types[i].id)
        }
    }

    for (let i = 0; i < nations.length; i++) {
        if (nations[i].checked == true) {
            nation.push(nations[i].id)
        }
    }

    for (let i = 0; i < effects.length; i++) {
        if (effects[i].checked == true) {
            effect.push(effects[i].id)
        }
    }

    if (types && nations && effects) {
        const postObject = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            name: $('#card-name').val(),
            image: $('#card-image').val(),
            type: type,
            nation: nation,
            resources: $('#card-resources').val(),
            attack: $('#card-attack').val(),
            defense: $('#card-defense').val(),
            mobility: $('#card-mobility').val(),
            vision: $('#card-vision').val(),
            effects: effect,
            readyToUse: $('#card-ready').is(":checked"),
            id: $('#card-id').val(),
            description: $('#card-description').val(),
            basicDeck: $('#card-basic-deck').val()
        }
        const stringifiedObject = JSON.stringify(postObject)

        $.ajax({
            type: "PUT",
            data: stringifiedObject,
            url: '/put/admin/modify/card',
            success: function (res) {
                if (res.token) {
                    window.localStorage.setItem("token", res.token)
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.responseJSON.action == "GO TO CARDS") {
                    window.location.pathname = '/manage/card'
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
    } else {
        alert('error')
    }
}

function logOut() {
    window.localStorage.clear()
    window.location.pathname = "/logout"
}