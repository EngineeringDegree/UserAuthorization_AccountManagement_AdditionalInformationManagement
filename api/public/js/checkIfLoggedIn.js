$(document).ready(init())

function init(){
    $.ajax({
        type: "GET",
        url: `/get/checkIfLoggedIn?email=${email}&token=${token}&refreshToken=${refreshToken}`,
        success: function(res){

        },
        error: function (xhr, ajaxOptions, thrownError) {

        },
        dataType: "json",
        contentType : "application/json"
    })
}