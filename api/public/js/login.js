$(document).ready(init())

function init(){
    $('#sign-in').on('click',  signIn)
}

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
            console.log(res)
        },
        error: function (xhr, ajaxOptions, thrownError) {

        },
        dataType: "json",
        contentType : "application/json"
    })
}

function getEmailValue(){
    return $('#email-login').val()
}

function getPasswordValue(){
    return $('#password-login').val()
}

