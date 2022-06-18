if(window.localStorage.getItem("userId")){
    var menuEl = document.getElementById("profile-page-menu")
    if(menuEl){
        menuEl.href += `?userId=${window.localStorage.getItem("userId")}`
    }
}