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
        type: $('#type').val(),
        buffNearbyAllies: $('#buff-nearby-allies').val(),
        debuffNearbyEnemies: $('#debuff-nearby-enemies').val(),
        mobility: $('#mobility').val(),
        defence: $('#defence').val(),
        attack: $('#attack').val(),
        vision: $('#vision').val(),
        stunImmunity: $('#stun-immunity').is(":checked"),
        scareImmunity: $('#scare-immunity').is(":checked"),
        silenceImmunity: $('#silence-immunity').is(":checked"),
        charge: $('#charge').is(":checked")
    }
    const stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "POST",
        data: stringifiedObject,
        url: '/post/admin/add/type',
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem("token", res.token)
            }

            alert("Success")
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.responseJSON.action == "LOGOUT") {
                logOut()
                return
            }

            alert('Error')
        },
        dataType: "json",
        contentType: "application/json"
    })
}

function logOut() {
    window.localStorage.clear()
    window.location.pathname = "/logout"
}