// global scope vairables for user action timers
var changePropagationTime = 1000, uChangeId, eChangeId, aChangeId, cChangeId

/**
 * Sets up timeout to send request which changes user username
 * @param {DOMElement} e which was modified 
 */
function usernameChanged(e){
    if(uChangeId){
        clearTimeout(uChangeId)
    }

    uChangeId = setTimeout(() => {
        console.log(e.target.value)
    }, changePropagationTime)
}

/**
 * Sets up timeout to send request which changes user email
 * @param {DOMElement} e which was modified 
 */
function emailChanged(e){
    if(eChangeId){
        clearTimeout(eChangeId)
    }

    eChangeId = setTimeout(() => {
        console.log(e.target.value)
    }, changePropagationTime)
}

/**
 * Sets up timeout to send request which changes user to an admin
 * @param {DOMElement} e which was modified 
 */
function adminChanged(e){
    if(aChangeId){
        clearTimeout(aChangeId)
    }

    aChangeId = setTimeout(() => {
        console.log(e.target.value)
    }, changePropagationTime)
}

/**
 * Sets up timeout to send request which changes user confirmation account status
 * @param {DOMElement} e which was modified 
 */
function confirmedChanged(e){
    if(cChangeId){
        clearTimeout(cChangeId)
    }

    cChangeId = setTimeout(() => {
        console.log(e.target.value)
    }, changePropagationTime)
}

/**
 * Ask for new password
 * @param {DOMElement} e button which was clicked 
 */
function askForNewPassword(e){
    console.log(e)
}