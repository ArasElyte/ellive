$(document).ready(function () {

    CheckAuth();

    $("#loginButton").click(function () {

        var userName = $("#userName").val();
        var userPass = $("#userPassword").val();
        var errMsg = "";

        if (userName == "") {
            errMsg = errMsg + "Username Required<br/>";
        }
        if (userPass == "") {
            errMsg = errMsg + "Password Required<br/>";
        }

        if (errMsg !== "") {
            $("#errMsg").html(errMsg);
            $("#errMsg").css("display", "inline");
            $("#errMsg").css("color", "red");
            $("#errMsg").css("font-weight", "700");

        } else {
            $("#errMsg").css("display", "none");
            Authenticate();
        }
    });
});

function CheckAuth() {
    var meCookie = getCookie("simpleAuth");
    if (meCookie) {
        window.location = "dashboard.html";
    }
}

function Authenticate() {

    var userName = $("#userName").val();
    var userPass = $("#userPassword").val();
    var isValid = false;

    if (isValid == false) {
        if (userName == "Niko" && userPass == "RunIt2017!") {
            isValid = true;
            deleteCookie("simpleAuth");
            setCookie("simpleAuth", "Niko");
        } else {
            isValid = false;
        }
    }

    if (isValid == false) {
        if (userName == "Dave" && userPass == "N3ls0n") {
            isValid = true;
            deleteCookie("simpleAuth");
            setCookie("simpleAuth", "Dave");
        } else {
            isValid = false;
        }
    }

    if (isValid == false) {
        if (userName == "Aras" && userPass == "Ducati123") {
            isValid = true;
            deleteCookie("simpleAuth");
            setCookie("simpleAuth", "Aras");
        } else {
            isValid = false;
        }
    }

    if (isValid == false) {
        if (userName == "Ricky" && userPass == "3l1t3") {
            isValid = true;
            deleteCookie("simpleAuth");
            setCookie("simpleAuth", "Ricky");
        } else {
            isValid = false;
        }
    }

    if (isValid == false) {
        if (userName == "Deb" && userPass == "Elite123") {
            isValid = true;
            deleteCookie("simpleAuth");
            setCookie("simpleAuth", "Deb");
        } else {
            isValid = false;
        }
    }

    if (isValid == false) {
        $("#errMsg").html("Invalid Credentials");
        $("#errMsg").css("display", "inline");
        $("#errMsg").css("color", "red");
        $("#errMsg").css("font-weight", "700");
    } else {
        $("#errMsg").css("display", "inline");
        window.location = "dashboard.html";
    }

}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}
