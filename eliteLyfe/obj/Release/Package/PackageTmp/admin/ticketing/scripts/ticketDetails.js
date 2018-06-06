$(document).ready(function() {

    CheckAuth();


    var ticketId = url_query('tid');
    $("#myId").val(ticketId);

    if (ticketId !== "false" && ticketId !== false) {
        GetTicketDetail(ticketId);
        GetComments(ticketId);
    } else {
        //error message
    }

    $("#addComment").click(function() {
        $(".addComment").slideDown("slow");
        $("#addComment").slideUp("slow");
    });

    $("#cancelComment").click(function () {
        $(".addComment").slideUp("slow");
        $("#addComment").slideDown("slow");
    });

    $("#insertComment").click(function () {
        var title = $("#commentTitle").val();
        var desc = $("#commentDescription").val();
        var user = getCookie("simpleAuth");
        AddNewComment(title, desc, user);
        
    });


});

function AddNewComment(title, desc, user) {
    var id = $("#myId").val();

    var data = "{ticketId:" + id + ", title:'" + title + "',desc:'" + desc + "',user:'" + user + "'}";

    $.ajax({
        type: "POST",
        // data: JSON.stringify(model),
        url: "/Home/InsertTicketComment",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $("#greyform").fadeTo(50, 0.2);
            $("#loader").fadeTo(0, 1);
        },
        complete: function () {
            $("#greyform").hide();
            $("#loader").hide();
        },
        success: function (msg) {
            var tc = msg;

            $("#commentTitle").val("");
            $("#commentDescription").val("");

            GetComments(id);

            $(".addComment").slideUp("slow");
            $("#addComment").slideDown("slow");



        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });


}

function GetComments(id) {
    

    var data = "{ticketId:" + id + "}";

    $.ajax({
        type: "POST",
        // data: JSON.stringify(model),
        url: "/Home/GetTicketComments",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $("#greyform").fadeTo(50, 0.2);
            $("#loader").fadeTo(0, 1);
        },
        complete: function () {
            $("#greyform").hide();
            $("#loader").hide();
        },
        success: function (msg) {
            var tc = msg;

            var ticketComments = "";

            //TODO: if no results returned, display message
            for (var i = 0; i < tc.length; i++) {
                ticketComments = ticketComments + "<div class='ticketComment'>" +
                    "<div class='commentHeader'>" + tc[i].createdBy + " @ " + tc[i].dateCreated + "</div>" +
                    "<div class='commentTitle'>" + tc[i].commentTitle + "</div>" +
                    "<div class='commentDesc'>" + tc[i].commentDescription + "</div>" + 
                    "</div>";
                
            }

            $("#commentSection").html(ticketComments);


        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });


}

function GetTicketDetail(id) {


    var data = "{ticketId:" + id + "}";

    $.ajax({
        type: "POST",
       // data: JSON.stringify(model),
        url: "/Home/GetTicketDetails",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function () {
            $("#greyform").fadeTo(50, 0.2);
            $("#loader").fadeTo(0, 1);
        },
        complete: function () {
            $("#greyform").hide();
            $("#loader").hide();
        },
        success: function (msg) {
            var tc = msg;
            //TODO: if no results returned, display message
            var myStatus = "";
            for (var i = 0; i < tc.length; i++) {

                $("#ticketTitle").val(tc[i].ticketTitle);
                $("#ticketDescription").val(tc[i].ticketDescription);
                $("#createdBy").html("Created By: " + tc[i].createdBy + " on " + tc[i].dateCreated);
                $("#ticketAssigned").val(tc[i].assignedTo);
                $("#ticketStatus").val(tc[i].ticketStatus);
                myStatus = tc[i].ticketStatus;
                $("#ticketPriority").val(tc[i].ticketPriority);
                $("#ticketDueDate").val(tc[i].dueDate);
                $("#ticketType").val(tc[i].type);
            }

            //depending on status, enable or disable items in the drop down for status
            $("#ticketStatus option[value='ReOpened']").prop("disabled", "disabled");
            $("#ticketStatus option[value='Closed']").prop("disabled", "disabled");

            if (myStatus == "Closed") {
                $("#ticketStatus option[value='ReOpened']").removeAttr("disabled");
            }

            if (myStatus == "Resolved") {
                $("#ticketStatus option[value='New']").prop("disabled", "disabled");
                $("#ticketStatus option[value='InProc']").prop("disabled", "disabled");
                $("#ticketStatus option[value='ReOpened']").removeAttr("disabled");
                $("#ticketStatus option[value='Closed']").removeAttr("disabled");
            }

            if (myStatus == "ReOpened") {
                $("#ticketStatus option[value='New']").prop("disabled", "disabled");
                $("#ticketStatus option[value='InProc']").prop("disabled", "disabled");
                $("#ticketStatus option[value='Resolved']").removeAttr("disabled");
                $("#ticketStatus option[value='Closed']").removeAttr("disabled");
            }

        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

    
}


function CheckAuth() {
    var meCookie = getCookie("simpleAuth");
    if (!meCookie) {
        window.location = "index.html";
    }
}


function url_query(query) {
    query = query.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var expr = "[\\?&]" + query + "=([^&#]*)";
    var regex = new RegExp(expr);
    var results = regex.exec(window.location.href);
    if (results !== null) {
        return results[1];
    } else {
        return false;
    }
};

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