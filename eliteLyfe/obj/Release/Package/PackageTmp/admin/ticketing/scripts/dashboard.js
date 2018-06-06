$(document).ready(function () {

    CheckAuth();

    var myUserName = getCookie("simpleAuth");

    $("#allTickets").click(function() {
        window.location = "viewTickets.html";
    });
    $("#myTodo").click(function () {
        window.location = "viewTickets.html?assignedTo=" + myUserName;
    });
    $("#myOpened").click(function () {
        window.location = "viewTickets.html?openedBy=" + myUserName;
    });
    $("#closedTickets").click(function () {
        window.location = "viewTickets.html?type=Closed";
    });
    $("#addTicket").click(function () {
        window.location = "addTicket.html";
    });

    $("#newTickets").click(function () {
        window.location = "viewTickets.html?type=New";
    });

    $("#inProcTickets").click(function () {
        window.location = "viewTickets.html?type=InProc";
    });

    $("#resolvedTickets").click(function () {
        window.location = "viewTickets.html?type=Resolved";
    });

    $("#reopenedTickets").click(function () {
        window.location = "viewTickets.html?type=ReOpened";
    });

    $("#openTickets").click(function () {
        window.location = "viewTickets.html?type=OpenTix";
    });

    
  

});

function CheckAuth() {
    var meCookie = getCookie("simpleAuth");
    if (!meCookie) {
        window.location = "index.html";
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

