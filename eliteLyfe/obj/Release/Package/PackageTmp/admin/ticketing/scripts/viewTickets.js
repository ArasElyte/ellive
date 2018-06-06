$(document).ready(function() {

    CheckAuth();


    GetAllTix();



    $("#createTicket").click(function() {
        CreateNewTicket();
    });

    var myId = url_query('uid');
    if (myId !== "" && myId != false) {
        $("#userId").val(myId);
    }

    //TODO: get ID from cookie and used that for query

    

    $("#searchTickets").keyup(function() {
        var filter = $(this).val();

        $("#taskList tr").each(function() {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).fadeOut();
            } else {
                if ($(this).hasClass("hideMe") == false) {
                    $(this).show();
                }
            }
        });
    });

    $("#createCSV").click(function() {
        CreateTicketCSV();
    });
});

function CheckAuth() {
    var meCookie = getCookie("simpleAuth");
    if (!meCookie) {
        window.location = "index.html";
    }
}

function CreateTicketCSV() {

    //var data = "{ticketId:'" + ticketId + "',sequenceNumber:'" + newSeq + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetTicketCSV/",
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

            $("#downloadCSV").prop("href", "download/" +tc.fileLocation);
            $("#downloadCSV").css("display", "inline-block");

        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
    

}

function GetAllTix() {
    var qAssigned = url_query('assignedTo');
    var qCreated = url_query('openedBy');
    var qType = url_query('type');

    if (qAssigned == "false" || qAssigned == false) {
        qAssigned = "";
    }

    if (qCreated == "false" || qCreated == false) {
        qCreated = "";
    }

    if (qType == "false" || qType == false) {
        qType = "";
    }

    GetAllTickets(qType, qAssigned, qCreated);
}


function GetAllTickets(type, assigned, created) {

    var data = "{statusCode:'" + type + "',assignedTo:'" + assigned + "',createdBy:'" + created + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetAllTickets",
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

            var tc = msg;
            var myTicketHeader = "";
            myTicketHeader = '<div class="table-responsive"  data-pattern="priority-columns">' +
                            '<table class="table listingsTable">' +
                            '<thead>' +
                            '<tr class="rowItem">' +
                            '<th data-priority="0">Ticket ID</th>' +
                            '<th data-priority="1">Created</th>' +
                            '<th data-priority="1">Created By</th>' +
                            '<th data-priority="1">Assigned To</th>' +
                            '<th data-priority="6">Status</th>' +
                            '<th data-priority="3">Priority</th>' +
                            '<th data-priority="4">Sequence</th>' +
                            '<th data-priority="7">Est. Comp.</th>' +
                            '</tr>' +
                            '</thead>' +
                            '<tbody id="taskList">';

            var myTickets = myTicketHeader;


            //TODO: if no results returned, display message
            for (var i = 0; i < tc.length; i++) {

                myTickets = myTickets + '<tr class="rowItem" id="ticket_' + tc[i].ticketid + '">' +
                    '<td>' +
                    '<a style="cursor:pointer" href="ticketDetails.html?tid=' + tc[i].ticketid + '">' + tc[i].ticketTitle + '</a></li>' +
                    '</td>' +
                    '<td>' +
                    tc[i].dateCreated +
                    '</td>' +
                    '<td>' +
                    tc[i].createdBy +
                    '</td>' +
                    '<td>' +
                    tc[i].assignedTo +
                    '</td>' +
                    '<td>' +
                    tc[i].ticketStatus +
                    '</td>' +
                   
                    '<td>' +
                    tc[i].ticketPriority +
                    '</td>' +
                    '<td>' +
                    tc[i].ticketSequence +
                    '</td>' +
                    '<td>' +
                     tc[i].dueDate +
                    '</td></tr>';

            }

            myTickets = myTickets + '</tbody></table></div>';


            $("#ticketListing").html(myTickets);

            $("#taskList").sortable({
                placeholder: "ui-state-highlight",
                stop: function (event, ui) {
                    //alert($("#taskList").sortable("toArray"));
                    var serTasks = $("#taskList").sortable("serialize", {
                        attribute: "id"
                    });

                    var arrTasks = $("#taskList").sortable("toArray");
                    var myFileName = "";


                    //TODO:display spinner & hide
                    for (var p = 0; p < arrTasks.length; p++) {
                        myFileName = arrTasks[p];

                        console.log(arrTasks[p]);
                        UpdateTaskSequence(myFileName.replace("ticket_", ""), p + 1);
                        if (p == arrTasks.length - 1) {
                            //wait a few seconds and then requery to pull correct order
                            setTimeout(function () {
                                GetAllTix();
                            }, 100);
                        }

                    }
                }
            });


            //need this on drop sort??
            //var sortedIDs = $(".selector").sortable("toArray");
        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function UpdateTaskSequence(ticketId, newSeq) {

    var data = "{ticketId:'" + ticketId + "',sequenceNumber:'" + newSeq + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/UpdateTicketSequence",
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
