$(document).ready(function () {
    var validUser = CheckAuth();

    if (validUser) {
        GetMessages();
    }
});


function GetMessages() {

    var data = "{messageStatus:''}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetFormSubmissions",
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
                        '<p><span class="msgStatus ' + tc[j].status + '">' + tc[j].status + '</span><br/><small><span class="dayTime">' + tc[j].createdOn + '</span></small></p>' +
                        '<h5>' + tc[j].firstName + ' ' + tc[j].lastName + '</h5>' +
                        '<p>' +
                        'Email: ' + tc[j].email + '<br/>' +
                        'Phone: ' + tc[j].phone + '<br/>' +
                        'Travel To: ' + tc[j].travelTo + '<br/>' +
                        'Dates: ' + tc[j].monthToGo + '<br/>' +
                        'Budget: ' + tc[j].budget + '<br/>' +
                        'Occasion: ' + tc[j].occasion + '<br/>' +
                        'Page: ' + tc[j].submissionPage + '<br/>' +
                        '</p>' +
                        '</span></a>' +
                        '</li>';
                }

                messageHTML = messageHTML + "</ul>";

                $("#messageList").html(messageHTML);
            }

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
