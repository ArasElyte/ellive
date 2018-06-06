$(document).ready(function() {
    CheckAuth();
    $("#insertAmenity").click(function() {
        //insert 
        AddAmenity();
    });
    GetAmenities();

    $(document).on("click", ".deleteme", function (event) {

        var amenityId = this.id;

        var data = "{amenityId:" + amenityId + "}";
        $.ajax({
            type: "POST",
            //data: JSON.stringify(model),
            url: "/Home/DeleteAmenity",
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

                ResetForm();

                GetAmenities();
            },
            error: function (msg) {
                //alert("something went wrong! " + msg.exception);
                //error yo
            }
        });


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

function AddAmenity() {
    var amenityType = $("#amenityType").val();
    var amenityTitle = $("#amenityTitle").val();
    var amenityDescription = $("#amenityDescription").val();
   
    var errMsg = "";

    if (amenityType == "" || amenityType == "0") {
        errMsg = errMsg + "Type is required <br/>";
    }
    if (amenityTitle == "") {
        errMsg = errMsg + "Title is required <br/>";
    }

    if (errMsg !== "") {
        $('#errMsg').css("display", "inline");
        $('#errMsg').css("color", "red");
        $('#errMsg').css("font-weight", "700");
        $('#errMsg').html(errMsg);
    } else {
        $('#errMsg').css("display", "none");
        $('#errMsg').html("");
        InsertAmenity();
    }


}

function InsertAmenity() {
    var amenityType = $("#amenityType").val();
    var amenityTitle = $("#amenityTitle").val();
    var amenityDescription = $("#amenityDescription").val();
    amenityDescription = amenityDescription.trim();

    var data = "{amenityType:'" + amenityType + "',amenityTitle:'" + amenityTitle + "',amenityDescription:'" + amenityDescription + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/InsertNewAmenity",
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

            ResetForm();

            GetAmenities();
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function ResetForm() {

   // $("#amenityType").val("0");
    $("#amenityTitle").val("");
    $("#amenityDescription").val("");

}

function GetAmenities() {
    
    
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetAmenityList",
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

            var amenityStart = "";
            var amenityEnd = "";
            var amenityHeader = "";
            var amenityType = "";
            amenityHeader = "<h3>__TYPE__</h3>";


            amenityStart = '<br/><br/><ul class="amenity">';
            amenityEnd = "</ul>";

            var theAmenities = amenityStart;

            for (var i = 0; i < tc.length; i++) {

                if (amenityType !== tc[i].amenityType) {
                    amenityType = tc[i].amenityType;
                    theAmenities = theAmenities + '</ul><br/>' + amenityHeader.replace("__TYPE__", tc[i].amenityType) + '<ul class="amenity">';
                }
                theAmenities = theAmenities + '<li class="amenityListItem">' +
                    tc[i].amenityTitle + '<span class="deleteme" id="' + tc[i].amenityId + '">x</span></li>';

            }

            theAmenities = theAmenities + '</ul>';


            $("#amenityListing").html(theAmenities);
            //if lastType != myTYpe, then close last ul (not first run through),  <h2> type, new ul/li

          
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}