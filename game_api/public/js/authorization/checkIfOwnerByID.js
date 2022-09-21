$(document).ready(init())

/**
 * Function which checks if user is an owner of current page and hides not valid elements if not
 */
function init() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const userId = urlParams.get('userId')
    if (userId != window.localStorage.getItem('userId')) {
        var el = document.getElementById('user-decks')
        if (el) {
            el.remove()
        }
    }
}


