$(document).ready(init())

function init() {
    $.ajax({
        type: "GET",
        url: `/manage/get/nationsName/notReady?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}}`,
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem("token", res.token)
            }

            var el = document.getElementById('turned-off-nations')
            if (el) {
                el.textContent = ''
                if (res.nations.length == 0) {
                    el.textContent = 'None'
                }
                for (let i = 0; i < res.nations.length; i++) {
                    el.textContent += res.nations[i]
                    if (i != res.nations.length - 1) {
                        el.textContent += ','
                    }
                }
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