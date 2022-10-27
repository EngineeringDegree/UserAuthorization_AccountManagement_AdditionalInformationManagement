$(document).ready(init())

/**
 * Initialization function for all actions
 */
function init() {
    let userId = document.getElementById('user-id')
    sendRequest()

    /**
     * Sends request for user with current choosen parameters
     */
    function sendRequest() {
        if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken') && AUTHORIZATION_SERVER) {
            if (userId) {
                $.ajax({
                    type: "GET",
                    url: `${AUTHORIZATION_SERVER}/get/user/isOwner?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}&id=${userId.value}`,
                    success: function (res) {
                        if (res.token) {
                            window.localStorage.setItem("token", res.token)
                        }

                        let el = document.getElementById('to-user-decks')
                        if (el) {
                            let link = document.createElement('a')
                            link.textContent = 'My Decks'
                            link.href = `/decks?userId=${userId.value}`
                            el.appendChild(link)
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
        } else {
            logOut()
        }
    }

    /**
     * Hides linkes which shouldn't be visible if user is logged out
     */
    function logOut() {
        window.localStorage.clear()
        window.location.pathname = "/logout"
    }
}