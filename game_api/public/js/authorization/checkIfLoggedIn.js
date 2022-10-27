$(document).ready(init())

/**
 * Function which sends signal to backend to check if user is logged in and hides menu properly.
 */
function init() {
    let loggedIn = document.getElementsByClassName('logged-in')
    let loggedOut = document.getElementsByClassName('logged-out')

    if (window.location.pathname == '/logout') {
        logOut()
        return
    }

    if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken') && AUTHORIZATION_SERVER) {
        $.ajax({
            type: "GET",
            url: `${AUTHORIZATION_SERVER}/get/checkIfLoggedIn?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}`,
            success: function (res) {
                if (window.location.pathname == '/sign-in') {
                    window.location.pathname = '/'
                    return
                }
                if (res.token) {
                    window.localStorage.setItem("token", res.token)
                }

                logIn(res.admin)
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

    /**
     * Hides linkes which shouldn't be visible if user is logged out
     */
    function logOut() {
        window.localStorage.clear()
        window.location.pathname = '/logout'
    }

    /**
     * Hides linkes which shouldn't be visible if user is logged in
     * @param {boolean} admin contains if user is an admin
     */
    function logIn(admin = false) {
        for (let i = 0; i < loggedIn.length; i) {
            if (loggedIn[i].classList.contains('admin')) {
                if (!admin) {
                    loggedIn[i].remove()
                    continue
                }
            }
            loggedIn[i].classList.remove('d-none')
            i++
        }

        for (let i = 0; i < loggedOut.length; i) {
            loggedOut[i].remove()
        }
    }
}


