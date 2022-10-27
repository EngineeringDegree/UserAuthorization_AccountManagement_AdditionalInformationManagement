var timeoutId, timeoutTime = 1000, page = 1
$(document).ready(init())

/**
 * Initialization function for all actions
 */
function init() {
    let loggedIn = document.getElementsByClassName('logged-in')
    let loggedOut = document.getElementsByClassName('logged-out')

    if (window.location.pathname == '/logout') {
        logOut()
        return
    }

    if (window.location.pathname == '/registered') {
        logIn()
        return
    }

    let pageListener = document.getElementById('pageListener')
    if (pageListener) {
        pageListener.addEventListener('change', sendRequest, false)
    }

    let records = document.getElementById('records-per-page')
    if (records) {
        records.addEventListener('change', recordsPerPageChanged, false)
    }

    let typeName = document.getElementById('type-name')
    if (typeName) {
        typeName.addEventListener('keyup', typeNameChanged, false)
    }

    let pagesDisplay = document.getElementById('pages')
    let type = document.getElementById('types')

    sendRequest()

    /**
     * Makes get requests with choosen options
     */
    function recordsPerPageChanged() {
        sendRequest()
    }

    /**
     * Initialize 1 second timer to send request if nothing changes
     */
    function typeNameChanged() {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(() => {
            sendRequest()
        }, timeoutTime)
    }

    /**
     * Sends request for card with current choosen parameters
     */
    function sendRequest() {
        if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken')) {
            if (typeName && records) {
                $.ajax({
                    type: "GET",
                    url: `/manage/get/types?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}&records=${records.value}&typeName=${typeName.value}&page=${page}`,
                    success: function (res) {
                        if (res.token) {
                            window.localStorage.setItem("token", res.token)
                        }

                        if (res.page) {
                            page = res.page
                        }

                        displayReturnedInfo(res.types, res.page, res.pages, type, pagesDisplay, 'typeId', 'type')
                        logIn()
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

    /**
     * Hides linkes which shouldn't be visible if user is logged in
     */
    function logIn() {
        for (let i = 0; i < loggedIn.length; i++) {
            loggedIn[i].classList.remove('d-none')
        }

        for (let i = 0; i < loggedOut.length; i) {
            loggedOut[i].remove()
        }
    }
}