if (window.localStorage.getItem("userId")) {
    var menuEl = document.getElementById("profile-page-menu")
    if (menuEl) {
        menuEl.href = `/users/user?userId=${window.localStorage.getItem("userId")}`
    }

    var packsEl = document.getElementById('packs-menu')
    if (packsEl) {
        packsEl.href = `/packs?userId=${window.localStorage.getItem("userId")}`
    }
}