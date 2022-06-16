$(document).ready(init())

/**
 * Initialization function for all actions
 */
function init(){
    var loggedIn = document.getElementsByClassName('logged-in')
    var loggedOut = document.getElementsByClassName('logged-out')
    var user = document.getElementById('user-profile')
    var userId = document.getElementById('user-id')
    sendRequest()

    /**
     * Sends request for card with current choosen parameters
     */
    function sendRequest(){
        if(window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken')){
            if(userId){
                $.ajax({
                    type: "GET",
                    url: `/get/user?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}&id=${userId.value}`,
                    success: function(res){
                        if(res.token){
                            window.localStorage.setItem("token", res.token)
                        }
                        displayReturnedInfo({ username: res.username,  email: res.email, admin: res.admin, confirmed: res.confirmed}, res.action == 'DISPLAY USER INFO AND BANHAMMER', res.action == 'DISPLAY USER INFO AND EDIT FORM')
                        
                        logIn()
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        if(xhr.responseJSON.action == "LOGOUT"){
                            logOut()
                            return
                        }
                    },
                    dataType: "json",
                    contentType : "application/json"
                })
            }
        }else{
            logOut()
        }   
    }

    /**
     * Creates dom element for user profile
     * @param {object} userInfo with username, email, admin and confirmed properties 
     * @param {boolean} admin if user is an admin and shoul attach banhammer as well
     * @param {boolean} owner if user is an owner of this account 
     */
    function displayReturnedInfo(userInfo, admin, owner){
        if(!user){
            return    
        }
        var element = document.createElement('div')
        var admin = document.createElement('input')
        admin.type = 'checkbox'
        admin.disabled = true

        var confirmed = document.createElement('input')
        confirmed.type = 'checkbox'
        confirmed.disabled = true

        if(owner){
            let username = document.createElement('input')
            username.value = userInfo.username
            element.appendChild(username)

            let email = document.createElement('input')
            email.value = userInfo.email
            element.appendChild(email)

            if(userInfo.admin){
                admin.checked = true
            }
            element.appendChild(admin)

            
            if(userInfo.confirmed){
                confirmed.checked = true
            }
            element.appendChild(confirmed)

            if(admin){
                element.appendChild(createBanUtility())
            }
            user.appendChild(element)
        } else {
            let username = document.createElement('p')
            username.textContent = userInfo.username
            element.appendChild(username)
    
            let email = document.createElement('p')
            email.textContent = userInfo.email
            element.appendChild(email)
    
            if(userInfo.admin){
                admin.checked = true
                admin.disabled = false
            }
            element.appendChild(admin)
    
            if(userInfo.confirmed){
                confirmed.checked = true
                confirmed.disabled = false
            }
            element.appendChild(confirmed)
    
            if(admin){
                element.appendChild(createBanUtility())
            }
            user.appendChild(element)
        }

    }

    /**
     * Hides linkes which shouldn't be visible if user is logged out
     */
    function logOut(){
        window.localStorage.clear()
        for(let i = 0; i < loggedIn.length; i++){
            loggedIn[i].classList.add('d-none')
        }
    
        for(let i = 0; i < loggedOut.length; i++){
            loggedOut[i].classList.remove('d-none')
        }
        window.location.pathname = "/logout"
    }
    
    /**
     * Hides linkes which shouldn't be visible if user is logged in
     */
    function logIn(){
        for(let i = 0; i < loggedIn.length; i++){
            loggedIn[i].classList.remove('d-none')
        }
    
        for(let i = 0; i < loggedOut.length; i++){
            loggedOut[i].classList.add('d-none')
        }
    }
}