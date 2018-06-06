$('input').bind("blur", function (value, settings) {
    var $this = $(this);
    ValidateControl($this);
});

$("select").change(function (param) {
    var $this = $(this);
    ValidateControl($this);
});

$('textarea').blur(function () {
    var $this = $(this);
    ValidateControl($this);
});

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function ValidateControl(control) {
   
        var $this = control;
        window.currentControl = $this;
        var thisId = $this.attr("id");
        var thisVal = document.getElementById($this.attr("id")).value;
        var myId = $("#myId").val();
        var saveData = true;

        var isValid = ValidateMe(thisId, thisVal);
        // emaill address validation may correct the email address to be valid, if so we want to capture the new value here.
        // otherwise it will be exactly the same
        thisVal = document.getElementById($this.attr("id")).value;

        var isRequiredField = IsRequiredField(thisId);

        if ((isValid === false && isRequiredField) || (isRequiredField && thisVal === "")) {
            saveData = false;
            // color the border RED, all of the SELECT elememebts have SPANs around them 
            // so color them RED as well
            $this.css("border-color", "red"); // jquery object
            if ($this.is("SELECT")) {
                $("#" + thisId + "-span").css("border-color", "red");
            }
        } else {
            $this.css("border-color", ""); // jquery object
            if ($this.is("SELECT")) {
                $("#" + thisId + "-span").css("border-color", "");
            }
        }

        var thisUser = getCookie("simpleAuth");

        if (saveData) {
            var data;

            //special cases
            switch (thisId) {
                
                case "ticketTitle":
                    data = JSON.stringify({ id: myId, field: "title", value: thisVal, user: thisUser });
                    break;
                case "ticketDescription":
                    data = JSON.stringify({ id: myId, field: "description", value: thisVal, user: thisUser });
                    break;
                case "ticketType":
                    data = JSON.stringify({ id: myId, field: "type", value: thisVal, user: thisUser });
                    break;
                case "ticketStatus":
                    data = JSON.stringify({ id: myId, field: "status", value: thisVal, user: thisUser });
                    break;
                case "ticketPriority":
                    data = JSON.stringify({ id: myId, field: "priority", value: thisVal, user: thisUser });
                    break;
                case "ticketAssigned":
                    data = JSON.stringify({ id: myId, field: "assignedTo", value: thisVal, user: thisUser });
                    break;
                case "ticketDueDate":
                    data = JSON.stringify({ id: myId, field: "dueDate", value: thisVal, user: thisUser });
                    break;
                
                default:
                    data = JSON.stringify({ id: myId, field: thisId, value: thisVal, user: thisUser });
                    break;
            }

            UpdateTicket(data);

        }
}

function UpdateTicket(data) {
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/UpdateTicket",
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

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function ValidateMe(id, value) {
    var val = value.trim();
    var isValid = true;
    var hiddenField = undefined;
    var valLen = 0;

    if (val !== undefined && val !== null) {
        valLen = val.trim().length;
    }

    switch (id) {

        case "ticketTitle":
        case "ticketDescription":
        case "ticketDueDate":
            isValid = isNotEmptyString(val);
            break;
        case "ticketAssigned":
        case "ticketPriority":
        case "ticketType":
        case "ticketStatus":
            isValid = ((val !== "0") ? true : false);
            break;
        default:
            // check for hidden fields, if they are we want to ignore them 
            hiddenField = $("#" + id);
            if (hiddenField.prop("type") === "hidden") {
                isValid = true;
            } else {
                isValid = false;
            }

    }
    return isValid;
};



/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function IsRequiredField(id) {
    var isRequired; //= true;

    switch (id) {
        case "EverythingIsRequiredAtThisPoint":
            isRequired = false;
            break;
        default:
            isRequired = true;
            break;
    }

    return isRequired;
};

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function isNotEmptyString(val) {
    return val !== undefined && val !== null && val.trim() !== null && val.trim() !== "";
};


/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function isBirthdayReal(bday) {
    var isReal = false;
    var year = bday.substr(6, 4);
    var today = new Date();
    var yyyy = today.getFullYear();
    var y100 = yyyy - 100;
    //MIN AGE
    if (year >= y100 && year <= yyyy) {
        isReal = true;
    }

    return isReal;
}

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
//* For this script and 100s more, visit http://www.javascriptkit.com
//* This notice must stay intact for usage 
function isValidDate(input) {

    var regExp = /^\d{2}\/\d{2}\/\d{4}$/; //Basic check for format validity
    var returnval;

    if (!regExp.test(input))
        returnval = false;
        //alert("Invalid Date Format. Please correct and submit again.")
    else { //Detailed check for valid date ranges
        var monthfield = input.split("/")[0];
        var dayfield = input.split("/")[1];
        var yearfield = input.split("/")[2];

        var dayobj = new Date(yearfield, monthfield - 1, dayfield);
        if ((dayobj.getMonth() + 1 != monthfield) || (dayobj.getDate() != dayfield) || (dayobj.getFullYear() != yearfield))
            //alert("Invalid Day, Month, or Year range detected. Please correct and submit again.")
            returnval = false;
        else
            returnval = true;
    }
    //if (returnval == false) input.select()

    return returnval;
}

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function FormatDOB(dobString) {

    var returnValue = dobString;

    if (isValidDate(dobString)) {

        var pad = '00';

        var dateArray = dobString.split("/", 3); // .replace('/-/g', '');

        var month = (pad + dateArray[0]).slice(-pad.length);
        var day = (pad + dateArray[1]).slice(-pad.length);
        var year = dateArray[2];

        returnValue = year + month + day;
    }
    return returnValue;
};



/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function isNotEmptyString(val) {
    return val !== undefined && val !== null && val.trim() !== null && val.trim() !== "";
};



/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function validatePhoneNumber(val) {
    var phoneNumberPattern = /^\(?(\d{3})\)?[- ]?(\d{3})[- ]?(\d{4})$/;
    return phoneNumberPattern.test(val);
}

function validatePostalCode(val) {
    var postalCodePattern = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;
    return postalCodePattern.test(val);
}

function validateCAPostalCode(val) {
    var postalCodePattern = /^(?![DFIOQU])([ABCEGHJ-NPRSTVXY]\d[A-Z][ ]?\d[A-Z]\d)$/;// /^[ABCEGHJKLMNPRSTVXY]\d[ -]?\d[A-Za-z]\d$/;
    return postalCodePattern.test(val.toUpperCase());
}

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
    
}

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function validateCurrency(val) {
    var regExp = /^\d+(\.\d{2})?$/;
    return regExp.test(val);
}

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function validateAlphaNumeric(alphanum) {
    var regExp = /^[a-zA-Z0-9 #,-.']+$/;
    return regExp.test(alphanum);
}
/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function validateCity(alpha) {
    //var regExp = /^[A-Za-z .'-áéíóú]+$/;
    var regExp = /^[A-Za-z .'-]+$/;
    return regExp.test(alpha);
}

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function validateName(alpha) {
    var regExp = /^[A-Za-z .'-]+$/;
    return regExp.test(alpha);
}

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function validateDate(dateString) {
    var regExp = /^(?=\d)(?:(?:31(?!.(?:0?[2469]|11))|(?:30|29)(?!.0?2)|29(?=.0?2.(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00)))(?:\x20|$))|(?:2[0-8]|1\d|0?[1-9]))([-./])(?:1[012]|0?[1-9])\1(?:1[6-9]|[2-9]\d)?\d\d(?:(?=\x20\d)\x20|$))?(((0?[1-9]|1[012])(:[0-5]\d){0,2}(\x20[AP]M))|([01]\d|2[0-3])(:[0-5]\d){1,2})?$/;
    return regExp.test(dateString);
}

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function ValidateFirstForm() {

    var returnValue = false;


    var prog = $("#progs").val();
    var fname = $("#fname").val();
    var lname = $("#lname").val();
    var email = $("#email").val().trim().toLowerCase();
    var confEmail = $("#conf-email").val().trim().toLowerCase();
    var refCode = $("#referralcode").val();
    var adKey = $("#adkey").val();
    var delMeth = "";
    var valDelMeth = false;

    var prevStudentId = $("#prevStudentId").val();
    var sLength = prevStudentId === undefined ? 0 : prevStudentId.trim().length;
    var sPrefix = sLength > 0 ? parseInt($("#prevStudentId").val().substr(0, 1)) : "0";





    //first things first, get an enrollid if we don't already have one
    //Google Autofillbug - just run all of the controls through (if we dont have an enroll id)

    var enrollid = $("#EnrollID").val();

    if (enrollid === "") {
        var $prog = $("#progs");
        ValidateControl($prog);
    }




    if ($("#delmethod-span").is(":visible")) {
        delMeth = $("#delMethods").val();
        valDelMeth = true;
    }


    //ClearErrorMessage();


    //program
    if (prog === "0") {
        DisplayErrorMsg($("#progs"), "Program required", 0);
    }
    else {
        ClearErrorMsg($("#progs"));

    }
    //deliver method
    if (valDelMeth) {
        if (delMeth === "0" || delMeth === 0) {
            DisplayErrorMsg($("#delMethods"), "Textbook Delivery Method required", 1);
        }
        else {
            ClearErrorMsg($("#delMethods"));
        }
    }


    //first name
    if (fname === "") {
        DisplayErrorMsg($("#fname"), "Student First Name required", 2);
    }
    else {

        var fn = ValidateMe("fname", fname);
        //$('#fn-req').remove();
        if (fn === false || fn === "false") {
            DisplayErrorMsg($("#fname"), "Student First Name is invalid", 2);
        }
        else {
            ClearErrorMsg($("#fname"));
        }
    }

    //last name
    if (lname === "") {
        DisplayErrorMsg($("#lname"), "Student Last Name required", 3);
    }
    else {
        var ln = ValidateMe("lname", lname);
        if (ln === false || ln === "false") {
            DisplayErrorMsg($("#lname"), "Student Last Name is invalid", 3);
        }
        else {
            ClearErrorMsg($("#lname"));
        }
    }

    //email
    if (email === "") {
        DisplayErrorMsg($("#email"), "Email Address required", 4);
    }
    else {
        $('#em-req').remove();
        $('#em-inv').remove();
        var em = ValidateMe("email", email);
        if (!em) {
            DisplayErrorMsg($("#email"), "Invalid Email Address", 4);
        } else {
            ClearErrorMsg($("#email"));
        }
    }

    //EOL-739 email confirmation
    if (confEmail === "") {
        //EOL-747 http://jira.pennfoster.edu/browse/EOL-747
        DisplayErrorMsg($("#conf-email"), "Confirm Email Address required", 5);
    }
    else if (confEmail !== email) {
        DisplayErrorMsg($("#conf-email"), "Email Address and Confirm Email fields must match", 5);
    } else {
        ClearErrorMsg($("#conf-email"));
    }

    var $postalObj = window.enrollment.CompanyNumber === "800" ? $("#capostalcode") : $("#zippostalcode");

    //zip code
    var validateZipResult = ValidateZipPostal();

    if (validateZipResult === "") {
        ClearErrorMsg($postalObj);
        //if its blank, we are OK
    }
    else {
        //the result will contain the error message
        DisplayErrorMsg($postalObj, validateZipResult, 6);
    }


    if ($("#prevGrad").is(":checked")) {
        if (sLength === 0 || sLength !== 8 || sPrefix < 1 || sPrefix > 4) {
            DisplayErrorMsg($("#prevStudentId"), "Invalid Student Id.", 7);
        } else {
            ClearErrorMsg($("#prevStudentId"));
        }
    } else {
        ClearErrorMsg($("#prevStudentId"));
    }



    // if they selected referredal then they need to enter a referral code
    //EOL-1304
    //https://jira.pennfoster.edu/browse/EOL-1306
    if (window.enrollment.CompanyNumber === "800") {
        if ($("#mediacode").val() === "RE" && refCode.trim() === "") {
            DisplayErrorMsg($("#referralcode"), "If referred by a student please enter Referral Code", 7);
        }
        else if (refCode === "") {
            //if they attempt to put in referral code, check it out, and if it doesnt follow format, stop them
            //and make them remove it, this will cut down on the invalid referral code issue
            //we dont care if its blank
            ClearErrorMsg($("#referralcode"));
        }
        else {
            //if they put something in there, we are going to make sure it validates

            var rc = validateReferralCode(refCode);
            //passed regex, now check length
            if (refCode.length !== 10) {
                rc = false;
            }
            if (!rc) {
                DisplayErrorMsg($("#referralcode"), "Invalid Referral Code - Please update or remove to continue", 7);
            }
            else {
                ClearErrorMsg($("#referralcode"));
            }
        }

    }


    if (adKey === "") {
        //we dont care if its blank
        ClearErrorMsg($("#adkey"));
    }
    else {
        //if they put something in there, we are going to make sure it validates
        var ak = validateAlphaNumeric(adKey);
        //passed regex, now check length
        if (!ak) {
            DisplayErrorMsg($("#referralcode"), "Invalid ID Number - Please update or remove to continue", 8);
        }
        else {
            ClearErrorMsg($("#adkey"));
        }
    }

    //TODO: Fix for Google Auto-Fill issue (if checked)
    //firstname, lastname, zippostalcode, 
    //???and program too!!! call ticket fix!!

    // if a message is displayed, true is returned
    returnValue = !ErrorMessageIsDisplayed(); // !DisplayErrorMessage(msgErr);

    if (returnValue) {
        if ($("#use-personal-info").is(':checked')) {
            $("#debit-fname").val($("#fname").val()); //.trigger("blur");
            $("#debit-lname").val($("#lname").val()); //.trigger("blur");
            $("#debit-zipcode").val($("#zippostalcode").val()); //.trigger("blur");
            $("#debit-city").val($("#city").val()); //.trigger("blur");
            $("#debit-state").val($("#state").val()); //.trigger("change");;
            $("#debit-postal").val($("#postal").val()); //.trigger("blur");
            $("#debit-prov").val($("#prov").val()); //.trigger("blur");
        }

        if ($("#use-personal-info-checking").is(':checked')) {
            $("#checkingcheckingfname").val($("#fname").val()); //.trigger("blur");
            $("#checking-lname").val($("#lname").val()); //.trigger("blur");
            $("#checking-zipcode").val($("#zippostalcode").val()); //.trigger("blur");
            $("#checking-city").val($("#city").val()); //.trigger("blur");
            $("#checking-state").val($("#state").val()); //.trigger("change");;
            $("#checking-postal").val($("#postal").val()); //.trigger("blur");
            $("#checking-prov").val($("#prov").val()); //.trigger("blur");
        }

        //The SP Defaults company code to 100, so updated based on what is set in the document
        //var data = JSON.stringify({ EnrollID: document.getElementById("EnrollID").value, Field: 'CompanyCode', Value: $("#companyCode").val() });
        //window.ajaxWs.CallRevampService("UpdateLead", data, true, false, false, callBackValidateControl, 'CompanyCode');
    }
    return returnValue;
}


/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function CheckDateFormat(e) {
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

    // check string os ONLY up to the current keyboard index.
    var chkString = fieldValue.substr(0, e.currentTarget.selectionStart) + asciiVal;
    //var entireFieldContents = fieldValue + ascii_val

    var regExp = /^[0-9]$/;

    var returnVal = true;
    var isNumeric = false;
    var isSlash = false;
    var singleDigitMonth = false;
    var singleDigitDay = false;

    if (chkString.length < 11) {
        for (var i = 0 ; i < chkString.length; i++) {

            // first check if the key pressed is a number or /
            isNumeric = regExp.test(chkString[i]);
            isSlash = chkString[i] == "/";

            // check for single digit month or day in current value
            if (fieldValue.indexOf("/") == 1) {
                singleDigitMonth = true;
            }
            if (fieldValue.lastIndexOf("/") == 3) {
                singleDigitDay = true;
            }




            if (isNumeric || isSlash) {
                var chval;
                if (i === 0) {
                    chval = chkString[i];
                    if (chval > 1 && !singleDigitMonth) {
                        returnVal = false;
                        break;
                    }
                }


                // don't allow double 00 in month, day, or century
                if (i > 0 && i < 7 && (fieldValue + asciiVal).indexOf("00") > 0) {
                    returnVal = false;
                    break;
                }


                if (i == 1) {
                    chval = chkString[i];
                    if (chval == "/") {
                        singleDigitMonth = true;
                    }
                    else if (chkString[0] + chval > 12) //check for valid month
                    {
                        returnVal = false;
                        break;
                    }

                }

                //check for valid day
                if (i === 2) {
                    chval = chkString[i];
                    if (singleDigitMonth) {
                        if (chval > 3) {
                            returnVal = false;
                            break;
                        }
                    }
                    else if (chval !== "/") {
                        returnVal = false;
                        break;
                    }
                }

                if (i === 3) {
                    chval = chkString[i];
                    if (chval == "/") {
                        singleDigitDay = true;
                    }
                    else if (singleDigitMonth) {
                        if (chkString[2] + chval > 31) {
                            //TODO Check for Leap Year??
                            returnVal = false;
                            break;
                        }
                    }
                    else if (chval > 3) {
                        returnVal = false;
                        break;
                    }
                }

                //if (i == 5 && !singleDigitDay && !singleDigitMonth && chkString[i] != "/") {
                //    returnVal = false;
                //    break;
                //}


                var notSingleDayMonth = singleDigitDay | singleDigitMonth;
                if (i == 5) {
                    if (!singleDigitDay && !singleDigitMonth && chkString[i] != "/") {
                        returnVal = false;
                        break;
                    }
                    if (notSingleDayMonth) {
                        if (chkString[i] != "/") {
                            returnVal = false;
                            break;
                        }
                    }
                }

                //checking for invalid position of slash "/"
                if ((i > 5 && chkString[i] == "/")
                    || (i == 0 && chkString[i] == "/")
                    || (chkString[i] == "/" && chkString[i - 1] == 0)
                    || (singleDigitMonth && singleDigitDay && i > 3)
                    || ((singleDigitMonth || singleDigitDay) && i > 4)
                    //|| chkString[i] + chkString[i+1] == "//") {
                    || (fieldValue + asciiVal).indexOf("//") > 0) {
                    returnVal = false;
                    break;
                }



                //var notSingleDayMonth = singleDigitDay | singleDigitMonth;
                //if (i == 5) {
                //    if (notSingleDayMonth) {
                //        if (chkString[i] != "/") {
                //            returnVal = false;
                //            break;
                //        }
                //    }
                //}

                //if (i === 2 || i === 5) {
                //    var chval = chkString[i];
                //    if (chval != "/") {
                //        returnVal = false;
                //        break;
                //    }
                //} //else {
                //    returnVal = regexNumberOnly.test(chkString[i]);
                //    if (!returnVal)
                //    { break; }
                //}
            } else {
                returnVal = false;
                break;
            }
        }
    }
    return returnVal;
};

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function CheckForDigitsOnly(e, minLen, maxLen) {

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

    //var homeEndIndex = homeEndKeys.indexOf(ascii_code);

    if ((exceptionChars.indexOf(asciiCode) > -1) || (!e.shiftKey && arroKeys.indexOf(asciiCode) > -1) || (homeEndKeys.indexOf(asciiCode) > -1 && !e.shiftKey)) {
        return true;
    }

    var field = $("#" + e.currentTarget.id);
    var fieldValue = field.val();
    var chkString = fieldValue + asciiVal;

    // ReSharper disable once AssignedValueIsNeverUsed
    var regExp = "";

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


/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
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

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function validAdressFormat(e) {
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

    var regEx = new RegExp("^[a-zA-Z0-9 #,.-]+$");
    var returnVal = regEx.test(chkString);

    return returnVal;
}

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function validCityFormat(e) {
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

    var regEx = new RegExp("^[a-zA-Z -.]+$");
    var returnVal = regEx.test(chkString);

    return returnVal;
}

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function validNameFormat(e) {
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

    var regEx = new RegExp("^[a-zA-Z -.]+$");
    var returnVal = regEx.test(chkString);

    return returnVal;
}

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
function unFormatDOB(sqlDob) {
    // we store DOB in yyyyMMdd format so we need to format it MMddyyyy when pulling down and populating the form
    var day = sqlDob.substr(6, 2);
    var month = sqlDob.substr(4, 2);
    var ccyy = sqlDob.substr(0, 4);

    return month + "/" + day + "/" + ccyy;
};



/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */
// http://stackoverflow.com/questions/8469436/how-format-javascript-date-with-regard-to-the-browser-culture
// http://blog.stevenlevithan.com/archives/date-time-format
var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
		    val = String(val);
		    len = len || 2;
		    while (val.length < len) val = "0" + val;
		    return val;
		};

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length === 1 && Object.prototype.toString.call(date) === "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) === "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
			    d: d,
			    dd: pad(d),
			    ddd: dF.i18n.dayNames[D],
			    dddd: dF.i18n.dayNames[D + 7],
			    m: m + 1,
			    mm: pad(m + 1),
			    mmm: dF.i18n.monthNames[m],
			    mmmm: dF.i18n.monthNames[m + 12],
			    yy: String(y).slice(2),
			    yyyy: y,
			    h: H % 12 || 12,
			    hh: pad(H % 12 || 12),
			    H: H,
			    HH: pad(H),
			    M: M,
			    MM: pad(M),
			    s: s,
			    ss: pad(s),
			    l: pad(L, 3),
			    L: pad(L > 99 ? Math.round(L / 10) : L),
			    t: H < 12 ? "a" : "p",
			    tt: H < 12 ? "am" : "pm",
			    T: H < 12 ? "A" : "P",
			    TT: H < 12 ? "AM" : "PM",
			    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
			    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
			    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

String.prototype.isNullOrWhiteSpace = function (val) {
    return val !== undefined && val !== null && val.trim() !== null && val.trim() !== "";
};

function validateCANPostalCode(postalCode) {
    var postalCodePattern = /^(?![DFIOQU])([ABCEGHJ-NPRSTVXY]\d[A-Z][ ]?\d[A-Z]\d)$/;// /^[ABCEGHJKLMNPRSTVXY]\d[ -]?\d[A-Za-z]\d$/;


    if (postalCode.trim() === "") {
        return "Zip Code required";
    }


    if (postalCodePattern.test(postalCode.toUpperCase())) {
        return "";
    } else {
        return "Invalid Zip Code";
    }
}

/*■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■*/