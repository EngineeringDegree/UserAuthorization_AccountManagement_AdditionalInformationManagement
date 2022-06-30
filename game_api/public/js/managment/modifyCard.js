var timeoutId, timeoutTime = 1000
$(document).ready(init())

/**
 * Adds event listener to input
 */
function init(){
    var cardName = document.getElementById('card-name')
    if(cardName){
        cardName.addEventListener('keyup', anythingChanged, false)
    }

    var image = document.getElementById('card-image')
    if(image){
        image.addEventListener('keyup', anythingChanged, false)
    }

    var type = document.getElementById('card-type')
    if(type){
        type.addEventListener('keyup', anythingChanged, false)
    }

    var nation = document.getElementById('card-nation')
    if(nation){
        nation.addEventListener('keyup', anythingChanged, false)
    }

    var resources = document.getElementById('card-resources')
    if(resources){
        resources.addEventListener('keyup', anythingChanged, false)
    }

    var attack = document.getElementById('card-attack')
    if(attack){
        attack.addEventListener('keyup', anythingChanged, false)
    }

    var defense = document.getElementById('card-defense')
    if(defense){
        defense.addEventListener('keyup', anythingChanged, false)
    }

    var mobility = document.getElementById('card-mobility')
    if(mobility){
        mobility.addEventListener('keyup', anythingChanged, false)
    }

    var effects = document.getElementById('card-effects')
    if(effects){
        effects.addEventListener('keyup', anythingChanged, false)
    }

    var description = document.getElementById('card-description')
    if(description){
        description.addEventListener('keyup', anythingChanged, false)
    }

    var readyToUse = document.getElementById('card-ready')
    if(readyToUse){
        readyToUse.addEventListener('mousedown', anythingChanged, false)
    }
}

/** 
 * Send request on something changed after 1 second
 */
function anythingChanged(){
    if(timeoutId){
        clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
        sendRequest()
    }, timeoutTime)
}

/**
 * Sends requests with user details and card details to patch on backend
 */
function sendRequest(){
    var postObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        name: $('#card-name').val(),
        image: $('#card-image').val(),
        type: [$('#card-type').val()],
        nation: [$('#card-nation').val()],
        resources: $('#card-resources').val(),
        attack: $('#card-attack').val(),
        defense: $('#card-defense').val(),
        mobility: $('#card-mobility').val(),
        effects: [$('#card-effects').val()],
        readyToUse: $('#card-ready').is(":checked"),
        id: $('#card-id').val(),
        description: $('#card-description').val()
    }
    var stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "PATCH",
        data: stringifiedObject,
        url: '/patch/admin/modify/card',
        success: function(res){
            if(res.token){
                window.localStorage.setItem("token", res.token)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if(xhr.responseJSON.action == "GO TO CARDS"){
                window.location.pathname = '/manage/card'
                return
            }

            if(xhr.responseJSON.action == "LOGOUT"){
                logOut()
                return
            }
        },
        dataType: "json",
        contentType : "application/json"
    })
}

function logOut(){
    window.localStorage.clear()
    window.location.pathname = "/logout"
}