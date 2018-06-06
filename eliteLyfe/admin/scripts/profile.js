
$(document).ready(function() {
    var validUser = CheckAuth();

    if (validUser) {
        GetProfileInfo(getCookie("simpleAuth"));
    }
});

function GetProfileInfo(user) {

    var data = "{user:'" + user + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetProfileInformation",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $("#greyform").fadeTo(50, 0.8);
            $("#loader").fadeTo(0, 1);
        },
        complete: function () {
            $("#greyform").hide();
            $("#loader").hide();
        },
        success: function (msg) {
            var tc = msg;
            $("#firstNameProfile").val(tc.firstName);
            $("#lastNameProfile").val(tc.lastName);
            $("#emailProfile").val(tc.emailAddress);
            $("#phoneProfile").val(tc.phoneNumber);
            $("#userType").html(tc.userType);
            $("#profileImage").attr("src", "../img/dashboard/" + tc.profileImage);
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
    
}

function CheckAuth() {
    var meCookie = getCookie("simpleAuth");
    if (meCookie) {
        $("#welcomeUser").html(meCookie);
        return true;
    } else {
        window.location = "index.html";
        return false;
    }
}
