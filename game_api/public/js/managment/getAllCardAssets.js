$(document).ready(init())

function init() {
    sendRequest()

    function sendRequest() {
        $.ajax({
            type: "GET",
            url: `/get/cardAssets/all?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}`,
            success: function (res) {
                if (res.token) {
                    window.localStorage.setItem("token", res.token)
                }

                var nations = document.getElementById('nations')
                var types = document.getElementById('types')
                var effects = document.getElementById('effects')

                var cardType = document.getElementById('card-type')
                var cardNation = document.getElementById('card-nation')
                var cardEffects = document.getElementById('card-effects')

                if (nations && types && effects) {
                    for (let i = 0; i < res.nations.length; i++) {
                        var p = document.createElement('p')
                        p.textContent = res.nations[i].name
                        nations.appendChild(p)
                        var checkbox = document.createElement('input')
                        checkbox.type = 'checkbox'
                        checkbox.id = res.nations[i]._id
                        if (cardNation) {
                            let value = cardNation.value
                            value = value.split(',')
                            for (let j = 0; j < value.length; j++) {
                                if (value[j] == res.nations[i]._id) {
                                    checkbox.checked = true
                                    break
                                }
                            }
                            checkbox.addEventListener('change', anythingChanged, false)
                        }
                        nations.appendChild(checkbox)
                    }

                    for (let i = 0; i < res.types.length; i++) {
                        var p = document.createElement('p')
                        p.textContent = res.types[i].name
                        types.appendChild(p)
                        var checkbox = document.createElement('input')
                        checkbox.type = 'checkbox'
                        checkbox.id = res.types[i]._id
                        if (cardType) {
                            let value = cardType.value
                            value = value.split(',')
                            for (let j = 0; j < value.length; j++) {
                                if (value[j] == res.types[i]._id) {
                                    checkbox.checked = true
                                    break
                                }
                            }
                            checkbox.addEventListener('change', anythingChanged, false)
                        }
                        types.appendChild(checkbox)
                    }

                    for (let i = 0; i < res.effects.length; i++) {
                        var p = document.createElement('p')
                        p.textContent = res.effects[i].name
                        effects.appendChild(p)
                        var checkbox = document.createElement('input')
                        checkbox.type = 'checkbox'
                        checkbox.id = res.effects[i]._id
                        if (cardEffects) {
                            let value = cardEffects.value
                            value = value.split(',')
                            for (let j = 0; j < value.length; j++) {
                                if (value[j] == res.effects[i]._id) {
                                    checkbox.checked = true
                                    break
                                }
                            }
                            checkbox.addEventListener('change', anythingChanged, false)
                        }
                        effects.appendChild(checkbox)
                    }
                }
            },
            error: function (xhr, ajaxOptions, thrownError) {
                if (xhr.responseJSON.action == "LOGOUT") {
                    window.location.pathname = '/logout'
                }
            },
            dataType: "json",
            contentType: "application/json"
        })
    }
}