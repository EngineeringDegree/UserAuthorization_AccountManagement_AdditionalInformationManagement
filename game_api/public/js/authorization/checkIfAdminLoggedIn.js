$(document).ready(init())

/**
 * Function which sends signal to backend to check if user is logged in and hides menu properly. It returns if user is an admin.
 */
function init(){
    var loggedIn = document.getElementsByClassName('logged-in')
    var loggedOut = document.getElementsByClassName('logged-out')

    if(window.location.pathname == '/logout'){
        logOut()
        return
    }

    if(window.location.pathname == '/registered'){
        logIn()
        return
    }

    if(window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken') && AUTHORIZATION_SERVER){
        $.ajax({
            type: "GET",
            url: `${AUTHORIZATION_SERVER}/get/admin/checkIfLoggedIn?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}`,
            success: function(res){
                if(window.location.pathname == '/sign-in'){
                    window.location.pathname = '/'
                    return
                }
                if(res.token){
                    window.localStorage.setItem("token", res.token)
                }
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
    }else{
        logOut()
    }   

    /**
     * Hides linkes which shouldn't be visible if user is logged out
     */
    function logOut(){
        window.localStorage.clear()
        for(let i = 0; i < loggedIn.length; i){
            loggedIn[i].remove()
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
    
        for(let i = 0; i < loggedOut.length; i){
            loggedOut[i].remove()
        }
    }
}


