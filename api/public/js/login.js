$(document).ready(init())

/**
 * Initializes on button click event
 */
function init(){
    $('#sign-in').on('click',  signIn)
}

/**
 * Sends login signal to backend
 * @returns none 
 */
function signIn(){
    var postObject = {
        email: getEmailValue(),
        password: getPasswordValue()
    }

    if(postObject.email == ""){
        return
    }

    if(postObject.password == ""){
        return
    }

    var stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "PATCH",
        url: "/patch/login",
        data: stringifiedObject,
        success: function(res){
            
        },
        error: function (xhr, ajaxOptions, thrownError) {

        },
        dataType: "json",
        contentType : "application/json"
    })
}

/**
 * Gets email value from input
 * @returns email input value
 */
function getEmailValue(){
    return $('#email-login').val()
}

/**
 * Gets password value from input
 * @returns password input value
 */
function getPasswordValue(){
    return $('#password-login').val()
}

