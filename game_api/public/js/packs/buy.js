$(document).ready(init())

/**
 * Initialize buttons to use buyPack function as onClick handler
 */
function init() {
    let buttons = document.getElementsByClassName('buy-pack-buttons')
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", buyPack)
    }

    /**
     * Sends request to buy pack for user
     * @param {DOM element} e event emmiter (most possibly button) 
     */
    function buyPack(e) {
        if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken')) {
            const patchObject = {
                email: window.localStorage.getItem('email'),
                token: window.localStorage.getItem('token'),
                refreshToken: window.localStorage.getItem('refreshToken'),
                id: e.target.id
            }
            const stringifiedObject = JSON.stringify(patchObject)

            $.ajax({
                type: "POST",
                url: `/post/user/packs`,
                data: stringifiedObject,
                success: function (res) {
                    if (res.token) {
                        window.localStorage.setItem("token", res.token)
                    }

                    alert('Success')
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

    /**
     * Hides linkes which shouldn't be visible if user is logged out
     */
    function logOut() {
        window.localStorage.clear()
        window.location.pathname = "/logout"
    }
}