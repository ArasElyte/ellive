$(document).ready(function() {
    $(".sendToContact").click(function() {
        GoToContactForm();
    });

    $(".ecSignupButton").click(function () {
        var email = $("#emailSignupFooter").val();
        var signup = validateEmail(email);

        if (signup) {
            SignUpForNews(email);
        } else {
            alert("invalid email");
        }
    });

    $("#submitListingInquiry").click(function() {
        var fname = $("#index_first_name").val();
        var lname = $("#index_last_name").val();
        var email = $("#index_email").val();
        var phone = $("#index_phone_number").val();
        var arrive = $("#arriveDate").val();
        var depart = $("#departDate").val();
        var numGuests = $("#numGuests").val();
        var errMsg = "";
        var submissionPage = window.location.href;

        if (fname == "") {
            errMsg = errMsg + "First Name Required<br/>";
        }

        if (email == "") {
            errMsg = errMsg + "Email Address Required<br/>";
        }
        if (depart == "") {
            errMsg = errMsg + "Departure Date Required<br/>";
        }
        if (arrive == "") {
            errMsg = errMsg + "Arrival Date Required<br/>";
        }
        if (numGuests == "") {
            errMsg = errMsg + "Number of Guests Required<br/>";
        }

        if (errMsg !== "") {
            alert(errMsg);
        } else {
            SubmitBooking(fname, lname, email, phone, depart, arrive, numGuests, submissionPage);


        }
        //alert("ready to submit");
    });

    $("#submitRequestButton").click(function() {
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
        var submissionPage = window.location.href;

        if (fname == "") {
            errMsg = errMsg + "First Name Required<br/>";
        }

        if (email == "") {
            errMsg = errMsg + "Email Address Required<br/>";
        }

        if (errMsg !== "") {
            alert(errMsg);
        } else {
            SubmitForm(fname, lname, email, phone, travelTo, monthToGo, budget, occasion, submissionPage);
            

        }
        //alert("ready to submit");
    });
});

function SignUpForNews(email) {
    var data = "{email:'" + email + "'}";
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/EmailSubscribe",
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

            $("#emailSignupFooter").attr("placeholder", tc.status).val("").focus().blur();
        },
        error: function (msg) {
            ////alert("something went wrong! " + msg.exception);
        }
    });
}

function SubmitBooking(fname, lname, email, phone, arrive, depart, numGuests, submissionPage) {
    var occasion = "";
    var data = "{fname:'" + fname + "',lname:'" + lname + "',email:'" + email + "',phone:'" + phone + "',travelTo:'" + "--> arrival:" + arrive + "',monthToGo:'" + "--> departure:" + depart + "',budget:'" + "--> # guests:" + numGuests + "',occasion:'" + occasion + "',submissionPage:'" + submissionPage + "'}";

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

            $(".ecSubmitRequest").html("Thanks!");
            //$(".ecSubmitRequest").css("Thanks!");
            //TODO: Clear Form Data
            ClearFormData();

        },
        error: function (msg) {
            ////alert("something went wrong! " + msg.exception);
        }
    });
}

function SubmitForm(fname, lname, email, phone, travelTo, monthToGo, budget, occasion, submissionPage) {

    var data = "{fname:'" + fname + "',lname:'" + lname + "',email:'" + email + "',phone:'" + phone + "',travelTo:'" + travelTo + "',monthToGo:'" + monthToGo + "',budget:'" + budget + "',occasion:'" + occasion + "',submissionPage:'" + submissionPage + "'}";

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

            $(".ecSubmitRequest").html("Thanks!");
            //$(".ecSubmitRequest").css("Thanks!");
            //TODO: Clear Form Data
            ClearFormData();

        },
        error: function (msg) {
            ////alert("something went wrong! " + msg.exception);
        }
    });

}

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

function GoToContactForm() {
    $('html, body').animate({
        scrollTop: $('[id="contactForm"]').offset().top - 100
    }, 200);
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

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCopyrightYear() {
    var currentTime = new Date();
    return currentTime.getFullYear();
}



/*Validation*/
function ValidPhoneNumber(e, minLen, maxLen) {

    e = e || window.event;
    var asciiCode = e.which ? e.which : e.keyCode;
    var asciiVal = String.fromCharCode(asciiCode);

    var backSpace = 8;
    var tab = 9;
    var enter = 13;
    var end = 35;
    var home = 36;
    var leftArrow = 37;
    var rightArrow = 39;
    var deleteKey = 46;

    var exceptionChars = [backSpace, tab, enter, deleteKey];
    var arroKeys = [leftArrow, rightArrow];
    var homeEndKeys = [end, home];


    if ((exceptionChars.indexOf(asciiCode) > -1) || (!e.shiftKey && arroKeys.indexOf(asciiCode) > -1) || (homeEndKeys.indexOf(asciiCode) > -1 && !e.shiftKey)) {

        return true;
    }

    var field = $("#" + e.currentTarget.id);
    var fieldValue = field.val();
    var chkString = fieldValue + asciiVal;

    // ReSharper disable once AssignedValueIsNeverUsed
    var regExp = '';

    if (minLen === undefined || minLen === "undefined") {
        minLen = 1;
    }

    if (maxLen === undefined || maxLen === "undefined") {
        regExp = new RegExp("^[0-9]$");
    }
    else {
        regExp = new RegExp("^[0-9]{" + minLen + "," + maxLen + "}$");
    }

    var returnVal = regExp.test(chkString);

    return returnVal;
};

function validateAlphaNumeric(alphanum) {
    var regExp = /^[a-zA-Z0-9 #,-.']+$/;
    return regExp.test(alphanum);
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);

}
