$(document).ready(function() {

    $('#searchButton').click(function(e) {
        SearchTheListings($("#searchBox").val());
    });

    $("#searchButtonTop").click(function(e) {
        SearchTheListings($("#searchListings").val());
    });

    // $("#searchBox").combobox();

    $(document).keypress(function(e) {
        if (e.which == 13) {
            // enter pressed
            var meHasFocus = $(document.activeElement);
            meHasFocus = meHasFocus[0].id;

            switch (meHasFocus) {
            case "searchBox":
                SearchTheListings($("#searchBox").val());
                break;
            case "searchListings":
                SearchTheListings($("#searchListings").val());
                break;
            default:
                //DO Nothing (eventualy submit form)
            }
            // SearchTheListings($("#searchBox").val());
        }
    });

    $("#submitRequestButton").click(function () {
        var fname = $("#index_first_name").val();
        var lname = $("#index_last_name").val();
        var email = $("#index_email").val();
        //var travelTo = $("#index_would_like_to_go option:selected").text();
        var travelTo = $("#index_would_like_to_go").val();
        travelTo = travelTo.replace("--", "");
        var phone = $("#index_phone_number").val();
        var monthToGo = $("#index_month_to_go option:selected").text();
        var budget = $("#index_budget").val();
        var occasion = $("#index_occasion").val();
        var errMsg = "";

        if (fname == "") {
            errMsg = errMsg + "First Name Required<br/>";
        }

        if (email == "") {
            errMsg = errMsg + "Email Address Required<br/>";
        }

        if (errMsg !== "") {
            alert(errMsg);
        } else {
            SubmitForm(fname, lname, email, phone, travelTo, monthToGo, budget, occasion);
            alert("Thanks!");
            //TODO: Clear Form Data
            ClearFormData();

        }
        //alert("ready to submit");
    });
});


function ClearFormData() {
    $("#index_first_name").val("");
    $("#index_last_name").val("");
    $("#index_email").val("");
    $("#index_phone_number").val("");
    $("#index_budget").val("");
    $("#index_occasion").val("");
    $("#index_month_to_go").val("");
    $("#index_would_like_to_go").val("");

}

function SubmitForm(fname, lname, email, phone, travelTo, monthToGo, budget, occasion) {

    var data = "{fname:'" + fname + "',lname:'" + lname + "',email:'" + email + "',phone:'" + phone + "',travelTo:'" + travelTo + "',monthToGo:'" + monthToGo + "',budget:'" + budget + "',occasion:'" + occasion + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/SubmitForm",
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
            var myListings = "";

        },
        error: function (msg) {
            ////alert("something went wrong! " + msg.exception);
        }
    });

}
