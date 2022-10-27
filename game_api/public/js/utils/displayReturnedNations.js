$(document).ready(init())

function init() {
    sendRequest()
}

function sendRequest() {
    $.ajax({
        type: "GET",
        url: `/manage/get/nations/all?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}}`,
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem("token", res.token)
            }

            if (res.page) {
                page = res.page
            }

            displayNations(res.nations)
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

    /**
     * Displays select with nations to choose
     * @param {array} nations 
     */
    function displayNations(nations) {
        let nationsPlace = document.getElementById('nations')
        if (nationsPlace) {
            let select = document.createElement('select')
            select.id = 'nation'
            select.addEventListener('change', modify, false)
            for (let i = 0; i < nations.length; i++) {
                let option = document.createElement('option')
                option.value = nations[i]._id
                option.textContent = nations[i].name
                select.appendChild(option)
            }
            // change select to use as first one already choosen pack
            nationsPlace.appendChild(select)
        }
    }

    /**
     * Sends modify request on change if on valid page
     */
    function modify() {
        if (window.location.pathname == '/manage/shopPack/modify') {
            const patchObject = {
                email: window.localStorage.getItem('email'),
                token: window.localStorage.getItem('token'),
                refreshToken: window.localStorage.getItem('refreshToken'),
                name: $('#pack-name').val(),
                nation: $('#nation').val(),
                price: $('#pack-price').val(),
                id: $('#pack-id').val(),
                readyToUse: $('#pack-ready').is(":checked"),
                cardsCount: $('#pack-count').val()
            }
            const stringifiedObject = JSON.stringify(patchObject)

            $.ajax({
                type: "PUT",
                data: stringifiedObject,
                url: '/put/admin/modify/shopPack',
                success: function (res) {
                    if (res.token) {
                        window.localStorage.setItem("token", res.token)
                    }
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (xhr.responseJSON.action == "GO TO MAPS") {
                        window.location.pathname = '/manage/map'
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
        }
    }
}