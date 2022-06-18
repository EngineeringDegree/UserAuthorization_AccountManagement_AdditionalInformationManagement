/**
 * Creates dom elemnt which makes ban utility for admin
 * @param {string} id of the user to ban
 * @returns {DOMElement} which is ban utility for admin
 */
function createBanUtility(id){
    let util = document.createElement('div')
    
    let select = document.createElement('select')
    select.id = id + '-select'

    let reason = document.createElement('input')
    reason.id = id + '-reason'

    let option = document.createElement('option')
    option.value = 1
    option.text = '1 day'
    select.appendChild(option)

    option = document.createElement('option')
    option.value = 7
    option.text = '7 days'
    select.appendChild(option)
    
    option = document.createElement('option')
    option.value = 31
    option.text = '1 Month'
    select.appendChild(option)
    
    option = document.createElement('option')
    option.value = 182
    option.text = '6 Months'
    select.appendChild(option)

    option = document.createElement('option')
    option.value = 365
    option.text = '1 Year'
    select.appendChild(option)

    option = document.createElement('option')
    option.text = '100 Years'
    option.value = 36500
    select.appendChild(option)

    let button = document.createElement('button')
    button.textContent = 'Ban user'
    button.id = id

    util.appendChild(select)
    util.appendChild(reason)
    util.appendChild(button)

    return util
}

/**
 * Ban request to send
 * @param {string} id of user against which request goes
 * @param {integer} value of days how long ban will last
 * @param {string} reason of ban
 */
function sendBanRequest(id, value, reason){
    var postObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        value: value,
        id: id,
        reason: reason
    }
    var stringifiedObject = JSON.stringify(postObject)

    $.ajax({
        type: "PATCH",
        data: stringifiedObject,
        url: `${AUTHORIZATION_SERVER}/patch/user/ban`,
        success: function(res){
            
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if(xhr.responseJSON.action == "LOGOUT"){
                window.location.pathname = '/logout'
                return
            }
        },
        dataType: "json",
        contentType : "application/json"
    })
}

/**
 * Sends call to ban user to backend
 * @param {DOMElement} e dom element which was clicked and start calling
 */
function banUser(e) {
    var select = document.getElementById(e.target.id + '-select')
    var reason = document.getElementById(e.target.id + '-reason')
    if(select && reason){
        if(select.value.trim() != '' && reason.value.trim() != ''){
            sendBanRequest(e.target.id, select.value, reason.value)
        }
    }
}
