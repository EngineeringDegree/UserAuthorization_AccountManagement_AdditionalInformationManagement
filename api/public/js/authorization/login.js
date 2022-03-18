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
    var checkIfNotValid = false
    var postObject = {
        email: getEmailValue(),
        password: getPasswordValue()
    }

    
    if(postObject.email == ""){
        checkIfNotValid = true

        emailEmptyError()
    }

    if(!validateEmail(postObject.email)){
        checkIfNotValid = true

        mustBeAnEmail()
    }

    if(postObject.password == ""){
        checkIfNotValid = true

        passwordEmptyError()
    }

    if(checkIfNotValid){
        return
    }

    var stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "PATCH",
        url: "/patch/login",
        data: stringifiedObject,
        success: function(res){
            window.localStorage.setItem('token', res.token)
            window.localStorage.setItem('refreshToken', res.refreshToken)
            window.localStorage.setItem('email', res.email)
            window.localStorage.setItem('username', res.username)

            window.location.pathname = '/'
        },
        error: function (xhr, ajaxOptions, thrownError) {
            showLoginError(thrownError)
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

/**
 * It shows user empty field communicate
 */
function emailEmptyError(){

}

/**
 * It shows user empty password field communicate
 */
function passwordEmptyError(){

}

/**
 * It shows user that email field must be an email
 */
function mustBeAnEmail(){

}

/**
 * This function shows user why his request didn't went through
 * @param {error object} err returned from the server error object
 */
 function showLoginError(err){

}

/**
 * Validates email string on client side
 * @param {string} email email string to be validated
 * @returns if string is an email (true of false)
 */
 function validateEmail(email){
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}

