$(document).ready(init())

/**
 * Initialize listener for button
 */
function init() {
    const el = document.getElementById('send-change-password')
    if (el) {
        el.addEventListener('click', sendChangePasswordRequest, false)
    }
}

/**
 * Send request for changing password
 */
function sendChangePasswordRequest() {
    const elPass = document.getElementById('password-register')
    const elRepPass = document.getElementById('password-repeat-register')
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const email = urlParams.get('email')
    const accessToken = urlParams.get('accessToken')
    if (elPass && elRepPass && email && accessToken) {
        const pass = elPass.value
        const repPass = elRepPass.value

        if (pass != repPass) {
            passwordsNotMatch()
            return
        }

        const postObject = {
            password: pass,
            repeatPassword: repPass,
            email: email,
            accessToken: accessToken
        }
        const stringifiedObject = JSON.stringify(postObject)

        $.ajax({
            type: "PATCH",
            url: `/patch/user/password`,
            data: stringifiedObject,
            success: function (res) {
                passwordChanged()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                showPasswordChangeError()
            },
            dataType: "json",
            contentType: "application/json"
        })
    }
}

/**
 * Passwords do not match error
 */
function passwordsNotMatch() {
    alert('Password do not match')
}

/**
 * Password change wasn't success
 */
function showPasswordChangeError() {
    alert('Something went wrong')
}

/**
 * Displayed password changed
 */
function passwordChanged() {
    alert('Password changed')
}