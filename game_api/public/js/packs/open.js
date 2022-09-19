$(document).ready(init())

/**
 * Initialize buttons to use openPack function as onClick handler
 */
function init() {
    var buttons = document.getElementsByClassName('open-pack-buttons')
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", openPack)
    }
}

/**
 * Sends request to open pack for user and shows what pack contains
 * @param {DOM element} e event emmiter (most possibly button) 
 */
function openPack(e) {
    if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken')) {
        var patchObject = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            id: e.target.id
        }
        var stringifiedObject = JSON.stringify(patchObject)

        $.ajax({
            type: "PATCH",
            url: `/patch/user/packs`,
            data: stringifiedObject,
            success: function (res) {
                if (res.token) {
                    window.localStorage.setItem("token", res.token)
                }

                var el = document.getElementById(`pack-${res.id}`)
                if (el) {
                    el.remove()
                }

                alert(res)
                // show cards obtained
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.responseJSON.token) {
                    window.localStorage.setItem("token", xhr.responseJSON.token)
                }

                if (xhr.responseJSON.action == "SOMETHING WENT WRONG POPUP") {
                    alert('Something went wrong - try again later')
                    return
                }

                if (xhr.responseJSON.action == "LOGOUT") {
                    logOut()
                    return
                }
            },
            dataType: "json",
            contentType: "application/json"
        })
    } else {
        logOut()
    }
}