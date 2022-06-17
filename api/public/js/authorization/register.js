$(document).ready(init())

/**
 * Initial function of registering new account which attaches signUp handler to button
 */
function init(){
    // On sign up button click do signUp logic
    $('#sign-up').on('click',  signUp)
}

/**
 * Sends ajax request to backend or shows user he has error
 */
function signUp(){
    var checkIfNotValid = false
    var postObject = {
        email: getEmailRegisterValue(),
        username: getUsernameValue(),
        password: getPasswordRegisterValue(),
        repeatPassword: getRepeatPasswordValue()
    }

    if(postObject.email == ""){
        checkIfNotValid = true

        emailEmptyError()
    }

    if(!validateEmail(postObject.email)){
        checkIfNotValid = true

        mustBeAnEmail()
    }

    if(postObject.username == ""){
        checkIfNotValid = true

        usernameEmptyError()
    }

    if(postObject.password == ""){
        checkIfNotValid = true

        passwordEmptyError()
    }

    if(postObject.password != postObject.repeatPassword){
        checkIfNotValid = true

        repeatPasswordEmptyError()
    }

    if(!getTermsValue()){
        checkIfNotValid = true

        tickTerms()
    }

    if(!getPrivacyValue()){
        checkIfNotValid = true

        tickPrivacy()
    }

    if(checkIfNotValid){
        return
    }

    var stringifiedObject = JSON.stringify(postObject)
    $.ajax({
        type: "POST",
        url: "/post/register",
        data: stringifiedObject,
        success: function(res){
            window.localStorage.setItem('userId', res.id)
            window.localStorage.setItem('accessToken', res.accessToken)
            window.localStorage.setItem('token', res.token)
            window.localStorage.setItem('refreshToken', res.refreshToken)
            window.localStorage.setItem('email', res.email)
            window.localStorage.setItem('username', res.username)

            window.location.pathname = '/registered'
        },
        error: function (xhr, ajaxOptions, thrownError) {
            showRegisterError(thrownError)
        },
        dataType: "json",
        contentType : "application/json"
    })
}

/**
 * Gets email value from input
 * @returns email input value
 */
function getEmailRegisterValue(){
    return $('#email-register').val()
}

/**
 * Gets username value from input
 * @returns username input value
 */
function getUsernameValue(){
    return $('#username-register').val()
}

/**
 * Gets password value from input
 * @returns password input value
 */
function getPasswordRegisterValue(){
    return $('#password-register').val()
}

/**
 * Get repeat password value from input
 * @returns repeat password input value
 */
function getRepeatPasswordValue(){
    return $('#password-repeat-register').val()
}

/**
 * Get if terms and conditions input is checked
 * @returns if terms input is checked 
 */
function getTermsValue(){
    return $('#terms')[0].checked
}

/**
 * Get if privacy policy input is checked
 * @returns if privacy policy is checked
 */
function getPrivacyValue(){
    return $('#privacy')[0].checked
}

/**
 * It shows user empty field communicate
 */
 function emailEmptyError(){

}

/**
 * It shows user empty username field communicate
 */
 function usernameEmptyError(){

}

/**
 * It shows user empty password field communicate
 */
function passwordEmptyError(){

}

/**
 * It shows user empty repeat password field communicate
 */
 function repeatPasswordEmptyError(){

}

/**
 * It shows user that he needs to tick terms
 */
 function tickTerms(){

}

/**
 * It shows user that he needs to tick privacy
 */
 function tickPrivacy(){

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
function showRegisterError(err){

}

/**
 * Validates email string on client side
 * @param {string} email email string to be validated
 * @returns if string is an email (true of false)
 */
function validateEmail(email){
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}