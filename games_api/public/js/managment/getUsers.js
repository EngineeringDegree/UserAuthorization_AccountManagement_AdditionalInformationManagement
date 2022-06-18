$(document).ready(init())

/**
 * Initialization function for all actions
 */
function init(){
    var timeoutId, timeoutTime = 1000, page = 1

    var loggedIn = document.getElementsByClassName('logged-in')
    var loggedOut = document.getElementsByClassName('logged-out')

    var records = document.getElementById('records-per-page')
    if(records){
        records.addEventListener('change', recordsPerPageChanged, false)
    }

    var username = document.getElementById('username')
    if(username){
        username.addEventListener('keyup', usernameChanged, false)
    }

    var pagesDisplay = document.getElementById('pages')
    var users = document.getElementById('users')

    sendRequest()

    /**
     * Makes get requests with choosen options
     */
    function recordsPerPageChanged(){
        sendRequest()
    }

    /**
     * Initialize 1 second timer to send request if nothing changes
     */
    function usernameChanged(){
        if(timeoutId){
            clearTimeout(timeoutId)
        }

        timeoutId = setTimeout(() => {
            sendRequest()
        }, timeoutTime)
    }

    /**
     * Sends request for card with current choosen parameters
     */
    function sendRequest(){
        if(window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken') && AUTHORIZATION_SERVER){
            if(username && records){
                $.ajax({
                    type: "GET",
                    url: `${AUTHORIZATION_SERVER}/get/users?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}&records=${records.value}&username=${username.value}&page=${page}`,
                    success: function(res){
                        if(res.token){
                            window.localStorage.setItem("token", res.token)
                        }

                        if(res.users.page){
                            page = res.users.page
                        }

                        displayReturnedInfo(res.users.users, res.users.page, res.users.pages, res.action == 'USERS FOUND AND SHOW BANHAMMER')
                        
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
     * Sets page to current page
     * @param {integer} e element of DOM which holds pageNum property 
     */

    function setPage(e){
        e.preventDefault()
        page = e.currentTarget.pageNum
        sendRequest()
    }

    /**
     * 
     * @param {array} records array of returned records
     * @param {integer} page page which is displayed right now
     * @param {integer} pages how much pages to display
     * @param {boolean} admin if user is an admin
     */
    function displayReturnedInfo(records, page, pages, admin){
        if(users && pagesDisplay){
            users.innerHTML = ''
            pagesDisplay.innerHTML = ''
            for(let i = 0; i < records.length; i++){
                let element = document.createElement('div')
                let link = document.createElement('a')
                link.textContent = records[i].username
                link.href = `/users/user?userId=${records[i].id}`
                element.appendChild(link)
                if(admin){
                    element.appendChild(createBanUtility(records[i].id))
                }
                users.appendChild(element)
                var btn = document.getElementById(records[i].id)
                if(btn){
                    btn.addEventListener('click', banUser, false)
                }
            }

            if(records.length == 0){
                let element = document.createElement('div')
                element.textContent = "Nothing to see here!"
                users.appendChild(element)
            }

            for(let i = 0; i < pages; i++){
                if(i + 1 == page){
                    let element = document.createElement('div')
                    element.textContent = i + 1
                    pagesDisplay.appendChild(element)
                }else{
                    let element = document.createElement('a')
                    element.textContent = i + 1
                    element.classList.add('clickable')
                    element.addEventListener('click', setPage ,false)
                    element.pageNum = i + 1
                    element.href = "#"
                    pagesDisplay.appendChild(element)
                }
            }
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