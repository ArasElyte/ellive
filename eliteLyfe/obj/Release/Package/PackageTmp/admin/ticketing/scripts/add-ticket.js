$(document).ready(function() {

    CheckAuth();
    $("#createTicket").click(function () {
        CreateNewTicket();
    });

    $("#ticketDueDate").datepicker();

    $("#userId").val(getCookie("simpleAuth"));

  //  GetAllTickets();

    $("#searchTickets").keyup(function () {
        var filter = $(this).val();

        $("#taskList tr").each(function () {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).fadeOut();
            } else {
                if ($(this).hasClass("hideMe") == false) {
                    $(this).show();
                }
            }
        });
    });

    Dropzone.autoDiscover = false;
    //Simple Dropzonejs 
    $("#dZUpload").dropzone({
        url: "../hn_FIleUpload.ashx",
        addRemoveLinks: true,
        success: function (file, response) {
            var imgName = response;
            $("#imageName").html(imgName);
            file.previewElement.classList.add("dz-success");
            console.log("Successfully uploaded :" + imgName);
        },
        error: function (file, response) {
            file.previewElement.classList.add("dz-error");
        }
    });

   // $("dz-message")"


})//end doc ready

function CheckAuth() {
    var meCookie = getCookie("simpleAuth");
    if (!meCookie) {
        window.location = "index.html";
    }
}


function CreateNewTicket() {

    var userId = $("#userId").val();
    var ticketTitle = $("#ticketTitle").val();
    var ticketDesc = $("#ticketDescription").val();
    var priorty = $("#ticketPriority").val();
    var assigendTo = $("#ticketAssigned").val();
    var dueDate = $("#ticketDueDate").val();
    var ticketType = $("#ticketType").val();


    var errMsg = "";

    if (ticketDesc == "                                        ") {
        ticketDesc = "";
    }

    if (ticketType == "" || ticketType=="0") {
        errMsg = errMsg + "Type is required <br/>";
    }

    if (ticketTitle == "") {
        errMsg = errMsg + "Title is required <br/>";
    }
    if (ticketDesc == "") {
        errMsg = errMsg + "Description is required <br/>";
    }
    if (priorty == "" || priorty == "0") {
        errMsg = errMsg + "Priority is required <br/>";
    }
    if (assigendTo == "" || assigendTo == "0") {
        errMsg = errMsg + "Assigned To is required <br/>";
    }
    if (dueDate == "" ) {
        errMsg = errMsg + "Due Date is required <br/>";
    }


    if (errMsg !== "") {
        $('#errMsg').css("display", "inline");
        $('#errMsg').css("color", "red");
        $('#errMsg').css("font-weight", "700");
        $('#errMsg').html(errMsg);
    } else {
        $('#errMsg').css("display", "none");
        $('#errMsg').html("");
        InsertTicket();
    }
}

function InsertTicket() {

    var userId = $("#userId").val();
    var ticketTitle = $("#ticketTitle").val();
    var ticketDesc = $("#ticketDescription").val();
    var assignedTo = $("#ticketAssigned").val();
    var dueDate = $("#ticketDueDate").val();
    var ticketPic = $("#imageName").html();
    var ticketType = $("#ticketType").val();

    ticketDesc = ticketDesc.trim();


    
    var priority = $("#ticketPriority").val();

    
    var data = "{userId:'" + userId + "',ticketTitle:'" + ticketTitle + "',ticketDesc:'" + ticketDesc + "',priority:'" + priority + "',assignedTo:'" + assignedTo + "',ticketPic:'" + ticketPic +"', dueDate:'" + dueDate +"',ticketType:'" + ticketType + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/InsertNewTicket",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function() {
            $("#greyform").fadeTo(50, 0.2);
            $("#loader").fadeTo(0, 1);
        },
        complete: function() {
            $("#greyform").hide();
            $("#loader").hide();
        },
        success: function(msg) {
            var tc = msg;

            //ClearTicketValues()
            //Success Message to user

            $("#ticketTitle").val("");
            $("#ticketDescription").val("");
            $("#ticketPriority").val("0");
            $("#ticketAssigned").val("0");

            $("#errMsg").html("Ticket Added!");
            $("#errMsg").css("display", "inline");
            $("#errMsg").css("color", "green");

            //  GetAllTickets();
        } ,
        error: function (msg) {
        alert("something went wrong! " + msg.exception);
            //error yo
    }
    });

};



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
