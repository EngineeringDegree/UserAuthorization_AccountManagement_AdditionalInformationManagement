$(document).ready(init())

/**
 * Initialization function for all actions
 */
function init() {
    var loggedIn = document.getElementsByClassName('logged-in')
    var loggedOut = document.getElementsByClassName('logged-out')
    sendRequest()

    /**
     * Sends request for user with current choosen parameters
     */
    function sendRequest() {
        if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken')) {
            $.ajax({
                type: "GET",
                url: `/get/user/cards?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}`,
                success: function (res) {
                    if (res.token) {
                        window.localStorage.setItem("token", res.token)
                    }
                    showResult(res.cards)
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
            logOut()
        }
    }

    /**
     * Shows all user cards on the screen
     * @param {object} cards cards object which user has
     */
    function showResult(cards) {
        console.log(cards)
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