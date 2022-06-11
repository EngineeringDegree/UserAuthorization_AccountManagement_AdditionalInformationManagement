$(document).ready(init())

/**
 * Initialization function for all actions
 */
function init(){
    var timeoutId, timeoutTime = 1000, page = 1
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

    var records = document.getElementById('records-per-page')
    if(records){
        records.addEventListener('change', recordsPerPageChanged, false)
    }

    var cardName = document.getElementById('card-name')
    if(cardName){
        cardName.addEventListener('keyup', cardNameChanged, false)
    }

    var pagesDisplay = document.getElementById('pages')
    var cards = document.getElementById('cards')

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
    function cardNameChanged(){
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
        if(window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken')){
            if(cardName && records){
                $.ajax({
                    type: "GET",
                    url: `/manage/get/cards?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}&records=${records.value}&cardName=${cardName.value}&page=${page}`,
                    success: function(res){
                        if(res.token){
                            window.localStorage.setItem("token", res.token)
                        }

                        if(res.page){
                            page = res.page
                        }
                        displayReturnedInfo(res.cards, res.page, res.pages)
                        logIn()
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        logOut()
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
     * @param {integer} p to which page should be changed 
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
     */
    function displayReturnedInfo(records, page, pages){
        if(cards && pagesDisplay){
            cards.innerHTML = ''
            pagesDisplay.innerHTML = ''
            for(let i = 0; i < records.length; i++){
                let element = document.createElement('div')
                let link = document.createElement('a')
                link.textContent = records[i].name
                link.href = `/manage/card/modify?cardId=${records[i]._id}`
                element.appendChild(link)
                cards.appendChild(element)
            }

            if(records.length == 0){
                let element = document.createElement('div')
                element.textContent = "Nothing to see here!"
                cards.appendChild(element)
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