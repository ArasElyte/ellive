$(document).ready(function () {
    var validUser = CheckAuth();

    if (validUser) {
        GetListingMessages();
    }
});


function GetListingMessages() {

    var data = "{messageStatus:''}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingMessages",
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
            var messageHTML = "";

            if (tc.length !== 0) {

                var alt = "";

                messageHTML = messageHTML + '<ul class="list-unstyled panel-list">';



                for (var j = 0; j < tc.length; j++) {

                    var xx = j % 2;
                    if (xx == 0) {
                        alt = "altRow";
                    } else {
                        alt = "";
                    }
                    messageHTML = messageHTML + '<li class="messageCommon recentMessage listWrapper"><a class="messagLink href="#">' +
                       '<span class="messageInfo">' +
                       '<p><span class="msgStatus ' + tc[j].messageStatus + '">' + tc[j].messageStatus + '</span><br/><small><span class="dayTime">' + tc[j].createdOn + '</span></small><br/>' + tc[j].createdBy + '</p>' +
                       '<h5>' + tc[j].messageTitle + '</h5>' +
                       '<p>' + tc[j].messageBody + '</p>' +
                       '</span></a>' +
                       '</li>';

                }

                messageHTML = messageHTML + "</ul>";

                $("#messageList").html(messageHTML);
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
    if (meCookie) {
        $("#welcomeUser").html(meCookie);
        return true;
    } else {
        window.location = "index.html";
        return false;
    }
}
