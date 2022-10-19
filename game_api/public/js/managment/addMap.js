var savedConfigurations = [], currentIndex = -1, currentField = '', fields = [], choosingSpawnpoints = false
$(document).ready(init())

/**
 * Adds event listener to button
 */
function init() {
    getMapFields()
    var addBtn = document.getElementById('add-btn')
    if (addBtn) {
        addBtn.addEventListener('click', sendRequest, false)
    }

    var image = document.getElementById('image')
    if (image) {
        image.addEventListener('keyup', imageChanged, false)
    }

    var size = document.getElementById('size')
    if (size) {
        size.addEventListener('keyup', drawOverlay, false)
    }
}

/**
 * Sends requests with user details and card details to save to backend
 */
function sendRequest() {
    if (currentIndex >= 0) {
        var postObject = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            name: $('#name').val(),
            size: $('#size').val(),
            image: $('#image').val(),
            fields: savedConfigurations[currentIndex].fields,
            startingPositions: savedConfigurations[currentIndex].startingPositions,
            description: $('#description').val()
        }
        var stringifiedObject = JSON.stringify(postObject)

        $.ajax({
            type: "POST",
            data: stringifiedObject,
            url: '/post/admin/add/map',
            success: function (res) {
                if (res.token) {
                    window.localStorage.setItem("token", res.token)
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.responseJSON.action == "LOGOUT") {
                    logOut()
                    return
                }
            },
            dataType: "json",
            contentType: "application/json"
        })
    } else {
        alert("Fill all fields")
    }
}

function logOut() {
    window.localStorage.clear()
    window.location.pathname = "/logout"
}