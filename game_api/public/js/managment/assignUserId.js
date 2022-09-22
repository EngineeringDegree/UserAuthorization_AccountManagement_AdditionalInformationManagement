if (window.localStorage.getItem("userId")) {
    var menuEl = document.getElementById("profile-page-menu")
    if (menuEl) {
        menuEl.href = `/users/user?userId=${window.localStorage.getItem("userId")}`
    }

    var packsEl = document.getElementById('packs-menu')
    if (packsEl) {
        packsEl.href = `/packs?userId=${window.localStorage.getItem("userId")}`
    }

    var decksEl = document.getElementById('my-decks-menu')
    if (decksEl) {
        decksEl.href = `/decks?userId=${window.localStorage.getItem("userId")}`
    }

    var redirection = document.getElementById('create-new-deck-button')
    if (redirection) {
        redirection.href = `/decks/new?userId=${window.localStorage.getItem("userId")}&email=${window.localStorage.getItem("email")}&token=${window.localStorage.getItem("token")}&refreshToken=${window.localStorage.getItem("refreshToken")}`
    }
}