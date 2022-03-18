$(document).ready(init())

/**
 * Function which sends signal to backend to check if user is logged in and hides menu properly.
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

    if(window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken')){
        $.ajax({
            type: "GET",
            url: `/get/checkIfLoggedIn?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}`,
            success: function(res){
                if(window.location.pathname == '/sign-in'){
                    window.location.pathname = '/'
                    return
                }
                logIn()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                logOut()
    
                window.localStorage.clear()
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
        for(let i = 0; i < loggedIn.length; i++){
            loggedIn[i].classList.add('d-none')
        }
    
        for(let i = 0; i < loggedIn.length; i++){
            loggedOut[i].classList.remove('d-none')
        }
    }
    
    /**
     * Hides linkes which shouldn't be visible if user is logged in
     */
    function logIn(){
        for(let i = 0; i < loggedIn.length; i++){
            loggedIn[i].classList.remove('d-none')
        }
    
        for(let i = 0; i < loggedIn.length; i++){
            loggedOut[i].classList.add('d-none')
        }
    }
}


