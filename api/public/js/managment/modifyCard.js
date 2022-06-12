var timeoutId, timeoutTime = 1000
$(document).ready(init())

/**
 * Adds event listener to input
 */
function init(){
    var cardName = document.getElementById('card-name')
    if(cardName){
        cardName.addEventListener('keyup', cardNameChanged, false)
    }
}

/** 
 * Send request on name changed after 1 second
 */
function cardNameChanged(){
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
    if(checkName($('#card-name').val())){
        var postObject = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            name: $('#card-name').val(),
            id: $('#card-id').val()
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
}

function logOut(){
    window.localStorage.clear()
    window.location.pathname = "/logout"
}

/**
 * checks if name of the card is valid to use
 * @param {string} name card name
 * @returns 
 */
function checkName(name){
    if(!name){
        return false
    }

    if(name.trim() == ""){
        return false
    }

    return true
}