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
    var postObject = {
        email: getEmailRegisterValue(),
        username: getUsernameValue(),
        password: getPasswordRegisterValue(),
        repeatPassword: getRepeatPasswordValue()
    }

    if(postObject.email == ""){
        return
    }

    if(!validateEmail(postObject.email)){
        return
    }

    if(postObject.username == ""){
        return
    }

    if(postObject.password == ""){
        return
    }

    if(postObject.password != postObject.repeatPassword){
        return
    }

    if(!getTermsValue()){
        return
    }

    if(!getPrivacyValue()){
        return
    }

    var stringifiedObject = JSON.stringify(postObject)
    $.ajax({
        type: "POST",
        url: "/post/register",
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
 * Validates email string on client side
 * @param {string} email email string to be validated
 * @returns if string is an email (true of false)
 */
function validateEmail(email){
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}