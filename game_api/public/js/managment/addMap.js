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
        size: $('#size').val(),
        image: $('#image').val(),
        fields: [$('#fields').val()],
        startingPositions: [$('#starting-positions').val()],
        description: $('#description').val()
    }
    var stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "POST",
        data: stringifiedObject,
        url: '/post/admin/add/map',
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