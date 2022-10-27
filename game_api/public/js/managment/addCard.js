$(document).ready(init())

/**
 * Adds event listener to button
 */
function init() {
    let addBtn = document.getElementById('add-btn')
    if (addBtn) {
        addBtn.addEventListener('click', sendRequest, false)
    }
}

/**
 * Sends requests with user details and card details to save to backend
 */
function sendRequest() {
    const types = $("#types :input")
    const nations = $("#nations :input")
    const effects = $("#effects :input")

    let type = []
    let nation = []
    let effect = []

    for (let i = 0; i < types.length; i++) {
        if (types[i].checked == true) {
            type.push(types[i].id)
        }
    }

    for (let i = 0; i < nations.length; i++) {
        if (nations[i].checked == true) {
            nation.push(nations[i].id)
        }
    }

    for (let i = 0; i < effects.length; i++) {
        if (effects[i].checked == true) {
            effect.push(effects[i].id)
        }
    }

    if (types && nations && effects) {
        const postObject = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            name: $('#name').val(),
            image: $('#image').val(),
            type: type,
            nation: nation,
            resources: $('#resources').val(),
            attack: $('#attack').val(),
            defense: $('#defense').val(),
            mobility: $('#mobility').val(),
            vision: $('#vision').val(),
            effects: effect,
            description: $('#description').val(),
            basicDeck: $('#basic-deck').val()
        }
        const stringifiedObject = JSON.stringify(postObject)

        $.ajax({
            type: "POST",
            data: stringifiedObject,
            url: '/post/admin/add/card',
            success: function (res) {
                if (res.token) {
                    window.localStorage.setItem("token", res.token)
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert('error')
                if (xhr.responseJSON.action == "LOGOUT") {
                    logOut()
                    return
                }
            },
            dataType: "json",
            contentType: "application/json"
        })
    } else {
        alert('error')
    }
}

function logOut() {
    window.localStorage.clear()
    window.location.pathname = "/logout"
}