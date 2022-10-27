$(document).ready(init())

/**
 * Adds event listener to button
 */
function init() {
    var addBtn = document.getElementById('add-btn')
    if (addBtn) {
        addBtn.addEventListener('click', sendRequest, false)
    }
}

/**
 * Sends requests with user details and card details to save to backend
 */
function sendRequest() {
    var postObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        name: $('#name').val(),
        description: $('#description').val(),
        mobility: $('#mobility').val(),
        defence: $('#defence').val(),
        attack: $('#attack').val(),
        vision: $('#vision').val(),
        canUseOn: $('#can-use-on').val(),
        cooldown: $('#cooldown').val(),
        duration: $('#duration').val(),
        cost: $('#cost').val(),
        stunImmunity: $('#stun-immunity').is(":checked"),
        scareImmunity: $('#scare-immunity').is(":checked"),
        silenceImmunity: $('#silence-immunity').is(":checked"),
        stun: $('#stun').is(":checked"),
        scare: $('#scare').is(":checked"),
        silence: $('#silence').is(":checked")
    }
    var stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "POST",
        data: stringifiedObject,
        url: '/post/admin/add/effect',
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem("token", res.token)
            }

            alert('success')
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.responseJSON.action == "LOGOUT") {
                logOut()
                return
            }

            alert('error')
        },
        dataType: "json",
        contentType: "application/json"
    })
}

function logOut() {
    window.localStorage.clear()
    window.location.pathname = "/logout"
}