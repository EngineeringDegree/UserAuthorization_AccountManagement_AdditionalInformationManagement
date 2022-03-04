$(document).ready(init())

/**
 * Function which sends signal to backend to check if user is logged in and redirects him properly. It first on website load.
 */
function init(){
    $.ajax({
        type: "GET",
        url: `/get/checkIfLoggedIn?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}`,
        success: function(res){

        },
        error: function (xhr, ajaxOptions, thrownError) {

        },
        dataType: "json",
        contentType : "application/json"
    })
}