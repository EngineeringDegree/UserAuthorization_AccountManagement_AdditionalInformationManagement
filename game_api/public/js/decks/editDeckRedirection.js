$(document).ready(init())

/**
 * Adds event listeners to edit and delete buttons and do valid actions with it. 
 */
function init() {
    $('#edit-deck').on('click', editDeckRedirection)
    $('#delete-deck').on('click', deleteDeck)
}

/**
 * Redirects user to edit deck page
 */
function editDeckRedirection() {
    var deckId = $('#my-decks').val()
    window.location.href = `/decks/edit?deckId=${deckId}&userId=${window.localStorage.getItem('userId')}&email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}`
}

/**
 * Tries to delete object on backend and shows result
 */
function deleteDeck() {
    var patchObject = {
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken'),
        deckId: $('#my-decks').val()
    }
    var stringifiedObject = JSON.stringify(patchObject)

    $.ajax({
        type: "PATCH",
        data: stringifiedObject,
        url: '/decks/remove',
        success: function (res) {
            if (res.token) {
                window.localStorage.setItem("token", res.token)
            }

            alterSelectElement(res.decks)
        },
        error: function (xhr, ajaxOptions, thrownError) {
            if (xhr.responseJSON.action == "REDIRECT TO MAIN SCREEN") {
                window.location.pathname = '/'
                return
            }

            if (xhr.responseJSON.action == "CHANGE DECK LIST ACCORDINGLY") {
                alterSelectElement(xhr.responseJSON.decks)
                return
            }

            if (xhr.responseJSON.action == "LOGOUT") {
                logOut()
                return
            }
        },
        dataType: "json",
        contentType: "application/json"
    })

    /**
     * Alters select DOM elements with list of decs to edit/remove
     * @param {array} decks objects which have to be altered to select DOM element
     * @returns void
     */
    function alterSelectElement(decks) {
        var select = document.getElementById('my-decks')
        if (select) {
            if (decks.length == 0) {
                select.remove()
                var editDeckBtn = document.getElementById('edit-deck')
                if (editDeckBtn) {
                    editDeckBtn.remove()
                }
                var removeDeckBtn = document.getElementById('delete-deck')
                if (removeDeckBtn) {
                    removeDeckBtn.remove()
                }
                return
            }

            select.innerHTML = ''
            for (let i = 0; i < decks.length; i++) {
                var opt = document.createElement('option')
                opt.value = decks[i]._id
                opt.textContent = `${decks[i].name} - ${decks[i].nation}`
                select.appendChild(opt)
            }
        }
    }
}