$(document).ready(init())

/**
 * Adds event listener to button
 */
function init() {
    let addBtn = document.getElementById('add-btn')
    if (addBtn) {
        addBtn.addEventListener('click', sendRequest, false)
    }
}

/**
 * Sends requests with user details and card details to save to backend
 */
function sendRequest() {
    const postObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        name: $('#name').val(),
        basicDefence: $('#basic-defence').val(),
        basicMobilityCost: $('#basic-mobility-cost').val(),
        visionCost: $('#vision-cost').val(),
        description: $('#description').val()
    }
    const stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "POST",
        data: stringifiedObject,
        url: '/post/admin/add/field',
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
}

function logOut() {
    window.localStorage.clear()
    window.location.pathname = "/logout"
}