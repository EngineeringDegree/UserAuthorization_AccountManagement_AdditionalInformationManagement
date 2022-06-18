$(document).ready(init())

/**
 * Adds event listener to button
 */
function init(){
    var addBtn = document.getElementById('add-btn')
    if(addBtn){
        addBtn.addEventListener('click', sendRequest, false)
    }
}

/**
 * Sends requests with user details and card details to save to backend
 */
function sendRequest(){
    var postObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        name: $('#name').val(),
        image: $('#image').val(),
        type: [$('#type').val()],
        nation: [$('#nation').val()],
        resources: $('#resources').val(),
        attack: $('#attack').val(),
        defense: $('#defense').val(),
        mobility: $('#mobility').val(),
        effects: [$('#effects').val()]
    }
    var stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "POST",
        data: stringifiedObject,
        url: '/post/admin/add/card',
        success: function(res){
            if(res.token){
                window.localStorage.setItem("token", res.token)
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
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