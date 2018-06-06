$(document).ready(function () {
    CheckAuth();

    //$("#rateStartDate").datepicker();
    //$("#rateEndDate").datepicker();

    $("#addListing1").click(function() {

        //validate
        var errMsg = "<br/><br/>";
        var lTitle = $("#listingTitle").val();
        var lCat = $("#listingCategory").val();
        

      

        var errorTemplate = ' <div class="form-group col-sm-4 col-xs-12"><div class="alert alert-danger fade in alert-dismissable">' +
'<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
'**ERROR_MESSAGE_REPLACE**' +
'</div></div>';

        if (lTitle == "") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Title is required.<br/>");
            $("#listingTitle").addClass("error");
        } else {
            $("#listingTitle").removeClass("error");
        }

        if (lCat == "" || lCat == "0") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Category is required.<br/>");
            $("#listingCategory").addClass("error");
        } else {
            $("#listingCategory").removeClass("error");
        }

        

        if (errMsg != "<br/><br/>") {
            $(".errMsg").html(errMsg);
        } else {
            //
            AddNewListing(lTitle, lCat);
            //insert new record, get back the id, redirect to the edit listing of that id
            
            $(".errMsg").html("");
        }
        
    });

  

});

function CheckAuth() {
    var meCookie = getCookie("simpleAuth");
    if (meCookie) {
        $("#welcomeUser").html(meCookie);
    } else {
        window.location = "index.html";
    }
}

function AddNewListing(title, category) {
    
    

    var data = "{title:'" + title + "',category:'" + category + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/AddNewListing",
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

            window.location = "edit-listings.html?lid=" + tc.id;
            
        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}