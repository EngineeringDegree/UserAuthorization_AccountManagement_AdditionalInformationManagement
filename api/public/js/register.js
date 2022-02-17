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
        repeatPasword: getRepeatPasswordValue(),
        terms: getTermsValue(),
        privacy: getPrivacyValue(),
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