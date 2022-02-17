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
        email: getEmailValue(),
        username: getUsernameValue(),
        password: getPasswordValue(),
        repeatPasword: getRepeatPasswordValue()
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

    if(postObject.password != postObject.repeatPasword){
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

function getEmailValue(){
    return $('#email-register').val()
}

function getUsernameValue(){
    return $('#username-register').val()
}

function getPasswordValue(){
    return $('#password-register').val()
}

function getRepeatPasswordValue(){
    return $('#password-repeat-register').val()
}

function getTermsValue(){
    return $('#terms')[0].checked
}

function getPrivacyValue(){
    return $('#privacy')[0].checked
}

function validateEmail(email){
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}