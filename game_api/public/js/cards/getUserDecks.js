$(document).ready(init())

/**
 * Initialize request for getting user decks
 */
function init() {
    var loggedIn = document.getElementsByClassName('logged-in')
    var loggedOut = document.getElementsByClassName('logged-out')

    if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken')) {
        $.ajax({
            type: "GET",
            url: `/get/user/decks?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}`,
            success: function (res) {
                if (res.token) {
                    window.localStorage.setItem("token", res.token)
                }

                var div = document.getElementById('user-deck')
                if (div) {
                    var select = document.createElement('select')
                    select.id = 'user-decks'
                    for (let i = 0; i < res.decks.length; i++) {
                        var opt = document.createElement('option')
                        opt.value = res.decks[i]._id
                        opt.innerHTML = `${res.decks[i].name} ${res.decks[i].nation} ${res.decks[i].strength}`
                        select.appendChild(opt)
                    }
                    div.appendChild(select)
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.responseJSON.token) {
                    window.localStorage.setItem("token", xhr.responseJSON.token)
                }

                if (xhr.responseJSON.action == 'REDIRECT TO PACKS PAGE') {
                    alert('We detected that you do not have any decks yet. We generated welcome pack just for you. In order to play you need to create your first deck. We will redirect you right now to page where you can open your packs and generate basic deck for you.')
                    window.location.href = '/packs?userId=' + window.localStorage.getItem('userId')
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

    /**
     * Hides linkes which shouldn't be visible if user is logged out
     */
    function logOut() {
        window.localStorage.clear()
        for (let i = 0; i < loggedIn.length; i) {
            loggedIn[i].remove()
        }

        for (let i = 0; i < loggedOut.length; i++) {
            loggedOut[i].classList.remove('d-none')
        }
        window.location.pathname = "/logout"
    }
}