// global scope variables for user action timers
var changePropagationTime = 1000, uChangeId

/**
 * Sets up timeout to send request which changes user username
 * @param {DOMElement} e which was modified 
 */
function usernameChanged(e) {
    if (uChangeId) {
        clearTimeout(uChangeId)
    }

    uChangeId = setTimeout(() => {
        if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken') && AUTHORIZATION_SERVER) {
            const patchObject = {
                email: window.localStorage.getItem('email'),
                token: window.localStorage.getItem('token'),
                refreshToken: window.localStorage.getItem('refreshToken'),
                newUsername: e.target.value
            }
            const stringifiedObject = JSON.stringify(patchObject)

            $.ajax({
                type: "PATCH",
                url: `${AUTHORIZATION_SERVER}/patch/user/username`,
                data: stringifiedObject,
                success: function (res) {
                    window.localStorage.setItem('username', res.username)
                    if (res.token) {
                        window.localStorage.setItem('token', res.token)
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
            logOut()
        }
    }, changePropagationTime)
}

/**
 * Sets up timeout to send request which changes user email
 */
function emailChanged() {
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken') && AUTHORIZATION_SERVER && email && password) {
        const patchObject = {
            email: window.localStorage.getItem('email'),
            newEmail: email.value,
            password: password.value
        }
        const stringifiedObject = JSON.stringify(patchObject)

        $.ajax({
            type: "PATCH",
            url: `${AUTHORIZATION_SERVER}/patch/user/email`,
            data: stringifiedObject,
            success: function (res) {
                window.localStorage.setItem('email', res.email)
                if (res.token) {
                    window.localStorage.setItem('token', res.token)
                }

                var confirmed = document.getElementById('confirmed')
                if (confirmed) {
                    confirmed.checked = false
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.responseJSON.action == "LOGOUT") {
                    logOut()
                    return
                }

                if (xhr.responseJSON.status == "EMAIL ALREADY REGISTERED") {
                    console.log("Email already taken")
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
 * Sets up timeout to send request which changes user to an admin
 * @param {DOMElement} e which was modified 
 */
function adminChanged(e) {
    if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken') && AUTHORIZATION_SERVER) {
        const patchObject = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            admin: e.target.checked,
            user: e.target.userId
        }
        const stringifiedObject = JSON.stringify(patchObject)

        $.ajax({
            type: "PATCH",
            url: `${AUTHORIZATION_SERVER}/patch/user/admin`,
            data: stringifiedObject,
            success: function (res) {
                if (res.token) {
                    window.localStorage.setItem('token', res.token)
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
        logOut()
    }
}

/**
 * Sets up timeout to send request which changes user confirmation account status
 * @param {DOMElement} e which was modified 
 */
function confirmedChanged(e) {
    if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken') && AUTHORIZATION_SERVER) {
        const patchObject = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            confirmed: e.target.checked,
            user: e.target.userId
        }
        const stringifiedObject = JSON.stringify(patchObject)

        $.ajax({
            type: "PATCH",
            url: `${AUTHORIZATION_SERVER}/patch/user/confirmed`,
            data: stringifiedObject,
            success: function (res) {
                if (res.token) {
                    window.localStorage.setItem('token', res.token)
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
        logOut()
    }
}

/**
 * Ask backend for sending email to change a password
 */
function askForNewPassword() {
    if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken') && AUTHORIZATION_SERVER) {
        const patchObject = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
        }
        const stringifiedObject = JSON.stringify(patchObject)

        $.ajax({
            type: "PATCH",
            url: `${AUTHORIZATION_SERVER}/patch/user/askPassword`,
            data: stringifiedObject,
            success: function (res) {
                if (res.token) {
                    window.localStorage.setItem('token', res.token)
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
        logOut()
    }
}

/**
 * Logout function
 */
function logOut() {
    window.localStorage.clear()
    window.location.pathname = "/logout"
}