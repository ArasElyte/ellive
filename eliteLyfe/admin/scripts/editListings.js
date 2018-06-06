rateDateArray = [];
Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}
function formatYYYY(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function getDates(startDate, stopDate) {
    var dateArray = new Array();
    var currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(formatYYYY(currentDate));
        currentDate = currentDate.addDays(1);
    }
    return dateArray;
}
$(document).ready(function() {

    var validUser = CheckAuth();

    if (validUser) {
        DoDocReady();
    }
});


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


function DoDocReady(){


  /*  $('input').bind("blur", function (value, settings) {
        var $this = $(this);
        ValidateControl($this);
    });

    $("select").change(function (param) {
        var $this = $(this);
        ValidateControl($this);
    });
    */
   /* $("#geoSubDivision").combobox().on("change", function () {
        if ($(this).val() !== "null" && $(this).val() !== null) {
            ValidateControl($(this));
        }
        
    });
    $("#destinationType").combobox().on("change", function () {
        if ($(this).val() !== "null" && $(this).val() !== null) {
            ValidateControl($(this));
        }
    });
    
   */

    GetAmenities();
    GetBedroomAmenities();
    GetBathroomAmenities();
    GetPolicies();
    GetCountries();
    GetStateProv();

    SetupSelects();

    $("#downloadPictures").click(function() {
        DownloadPictures();
    });

    $("#addressLink").click(function() {
        ShowSection("address");
    });

    $("#amenityLink").click(function () {
        ShowSection("amenity");
    });

    $("#bedroomLink").click(function () {
        ShowSection("bedroom");
    });

    $("#rateLink").click(function () {
        ShowSection("rate");
    });

    $("#ownerLink").click(function () {
        ShowSection("owner");
    });

    $("#pictureLink").click(function () {
        ShowSection("picture");
    });

    $("#aboutLink").click(function () {
        ShowSection("about");
    });

  




    //just show address 
    var theSection = url_query("pg");
    if (theSection) {
        ShowSection(theSection);
    } else {
        ShowSection("about");
    }

    $("#geoSubDivision1").change(function() {
        GetGeoSubDivsionByParent($('#geoSubDivision1').val(), 1);
    });

    $("#geoSubDivision2").change(function () {
        GetGeoSubDivsionByParent($('#geoSubDivision2').val(),2);
    });

    $("#geoSubDivision3").change(function () {
        GetGeoSubDivsionByParent($('#geoSubDivision3').val(),3);
    });
    
    var listingId = url_query("lid");
    $("#unitId").val(listingId);

    setTimeout(function () {
        GetListingDetail(listingId);
    }, 500);

    

    $("#listingLink").click(function() {
        window.open( "../listing-details.html?lid=" + listingId);
    });

    
    $("#addBedroomDetail").click(function () {
        $(".addBedroomDetail").slideDown("slow");
        $("#addBedroomDetail").slideUp("slow");
        $(".addBathroomDetail").slideUp("slow");
        $("#addBathroomDetail").slideDown("slow");
    });

    $("#cancelBedroom").click(function () {
        $(".addBedroomDetail").slideUp("slow");
        $("#addBedroomDetail").slideDown("slow");
    });

    $("#e_cancelBedroom").click(function () {
        $("#editBedroom").css("display", "none");
        $("#grayout").css("display", "none");
    });

    $("#e_cancelFee").click(function () {
        $("#editFee").css("display", "none");
        $("#grayout").css("display", "none");
    });

    $("#updateFee").click(function () {
        var listingId = $("#unitId").val();
        var user = getCookie("simpleAuth");
        var feeId = $("#editFeeId").val();
        var type = $("#e_listingFeeType").val();
        var amount = $("#e_feeAmount").val();

        var errMsg = "";

        var errorTemplate = ' <div class="form-group col-sm-4 col-xs-12"><div class="alert alert-danger fade in alert-dismissable">' +
    '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
    '**ERROR_MESSAGE_REPLACE**' +
    '</div></div>';


        if (type == "" || type == "0") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Fee Type is required.<br/>");
            $("#e_feeType").addClass("error");
        } else {
            $("#e_feeType").removeClass("error");
        }

        if (amount == "" || amount == "0") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Fee Amount is required.<br/>");
            $("#e_feeAmount").addClass("error");
        } else {
            $("#e_feeAmount").removeClass("error");
        }

        if (parseFloat(amount)=="NaN") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Fee Amount is invalid.<br/>");
            $("#e_feeAmount").addClass("error");
        } else {
            amount = parseFloat(amount).toFixed(2);
            $("#e_feeAmount").removeClass("error");
        }

        if (errMsg == "") {
            $("#errMsgFees").css("display", "none");
            UpdateFee(user, listingId, feeId, type, amount);
        } else {
            //show error message
            $("#errMsgFees").html(errMsg);
            $("#errMsgFees").css("display", "inline");
        }

       

    });

    $("#updateRate").click(function () {
        var listingId = $("#unitId").val();
        var user = getCookie("simpleAuth");
        var rateId = $("#editRateId").val();
        var type = $("#e_rateType").val();
        var amount = $("#e_rateAmount").val();
        var startDate = $("#e_rateStartDate").val();
        var endDate = $("#e_rateEndDate").val();
        var minStay = $("#e_rateMinStay").val();
        var cancelPolicy = "60";
        cancelPolicy = $('input[name=e_optCancel]:checked').val();
        if ($("#e_cp60").is(':checked')) {
            cancelPolicy = "60";
        }
        if ($("#e_cp90").is(':checked')) {
            cancelPolicy = "90";
        }
        if ($("#e_cp120").is(':checked')) {
            cancelPolicy = "120";
        }

        var errMsg = "";

        var errorTemplate = ' <div class="form-group col-sm-4 col-xs-12"><div class="alert alert-danger fade in alert-dismissable">' +
    '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
    '**ERROR_MESSAGE_REPLACE**' +
    '</div></div>';


        if (type == "" || type == "0") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Rate Type is required.<br/>");
            $("#e_rateType").addClass("error");
        } else {
            $("#e_rateType").removeClass("error");
        }

        if (amount == "" || amount == "0") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Rate Amount is required.<br/>");
            $("#e_rateAmount").addClass("error");
        } else {
            $("#e_rateAmount").removeClass("error");
        }

        if (parseFloat(amount) == "NaN") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Rate Amount is invalid.<br/>");
            $("#e_rateAmount").addClass("error");
        } else {
            amount = parseFloat(amount).toFixed(2);
            $("#e_rateAmount").removeClass("error");
        }

        var sDate = "";
        var eDate = "";
        if (startDate !== "") {
            var stArr = startDate.split("/");
            if (stArr.length = 3) {
                sDate = new Date(stArr[0] + "/" + stArr[1] + "/" + stArr[2]);
                startDate = stArr[0] + "/" + stArr[1] + "/" + stArr[2];
            } else {
                sDate = "Invalid";
            }
        }

        if (endDate !== "") {
            var enArr = endDate.split("/");
            if (enArr.length = 3) {
                eDate = new Date(enArr[0] + "/" + enArr[1] + "/" + enArr[2]);
                endDate = enArr[0] + "/" + enArr[1] + "/" + enArr[2];
            } else {
                eDate = "Invalid";
            }
        }


        if (sDate == "Invalid") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Invalid Start Date mm/dd/yyY.<br/>");
            $("#e_rateStartDate").addClass("error");
        }

        if (eDate == "Invalid") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Invalid End Date mm/dd/yyY.<br/>");
            $("#e_rateEndDate").addClass("error");
        }

        if ((eDate - sDate < 0)&&(eDate!=="" && sDate!=="")) {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Start Date <= End Date.<br/>");
            $("#e_rateStartDate").addClass("error");
            $("#e_rateEndDate").addClass("error");
        }


        if (minStay == "" || minStay == "0") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Minimum Stay is required.<br/>");
            $("#e_rateMinStay").addClass("error");
        } else {
            $("#e_rateMinStay").removeClass("error");
        }

        if (errMsg == "") {
            $("#errMsgRates").css("display", "none");
             UpdateRate(user, listingId, rateId, type, amount, startDate, endDate, minStay, cancelPolicy);
        } else {
            //show error message
            $("#errMsgRates").html(errMsg);
            $("#errMsgRates").css("display", "inline");
        }

    });

    $("#updateBathroom").click(function () {
        var listingId = $("#unitId").val();
        var bathroomId = $("#editBathroomId").val();
        var title = $("#e_bathroomTitle").val();
        var desc = $("#e_bathroomDescription").val();
        var user = getCookie("simpleAuth");
        var amenities = "";
        var type = $("#e_bathroomType").val();


        $('.amenityBathroom div input').each(function (i) {
            var id = this.id;
            id = id.replace("bathAmen_", "");
            if (this.checked == true) {
                amenities = amenities + id + ',';
            }
        });
        //TODO: Validation
        UpdateBathroom(user, listingId, bathroomId, title, desc, amenities, type);
    });

    $("#updateBedroom").click(function () {
        var listingId = $("#unitId").val();
        var bedroomId = $("#editBedroomId").val();
        var title = $("#e_bedroomTitle").val();
        var desc = $("#e_bedroomDescription").val();
        var user = getCookie("simpleAuth");
        var amenities = "";
        var bedKing = $("#e_bedKing").val();
        var bedQueen = $("#e_bedQueen").val();
        var bedDouble = $("#e_bedDouble").val();
        var bedTwin = $("#e_bedTwin").val();
        var bedBunk = $("#e_bedBunk").val();
        var bedChild = $("#e_bedChild").val();
        var bedFuton = $("#e_bedFuton").val();
        var bedMurphy = $("#e_bedMurphy").val();
        var bedCrib = $("#e_bedCrib").val();
        var bedType = $("#e_bedroomType").val();
        $('.amenityBedroom div input').each(function (i) {

            var id = this.id;
            id = id.replace("bedAmen_", "");
            if (this.checked == true) {
                amenities = amenities + id + ',';
            }

        });


        //TODO: Validation
        UpdateBedroom(user, listingId, bedroomId, title, desc, amenities, bedKing, bedQueen, bedDouble, bedTwin, bedBunk, bedChild, bedFuton, bedMurphy, bedCrib,bedType);
    });

    

    $("#addBathroomDetail").click(function () {
        $(".addBathroomDetail").slideDown("slow");
        $("#addBathroomDetail").slideUp("slow");
        $(".addBedroomDetail").slideUp("slow");
        $("#addBedroomDetail").slideDown("slow");
    });

    $("#cancelBathroom").click(function () {
        $(".addBathroomDetail").slideUp("slow");
        $("#addBathroomDetail").slideDown("slow");
    });

    $("#e_cancelBathroom").click(function () {
        $("#editBathroom").css("display", "none");
        $("#grayout").css("display", "none");
    });

    $("#e_cancelRate").click(function () {
        $("#editRates").css("display", "none");
        $("#grayout").css("display", "none");
    });

    $("#addFeeDetail").click(function () {
        $(".addFeeDetail").slideDown("slow");
        $("#addFeeDetail").slideUp("slow");
        $(".addRateDetail").slideUp("slow");
        $("#addRateDetail").slideDown("slow");
    });

    $("#cancelFee").click(function () {
        $(".addFeeDetail").slideUp("slow");
        $("#addFeeDetail").slideDown("slow");
    });

    $("#addRateDetail").click(function () {
        $(".addRateDetail").slideDown("slow");
        $("#addRateDetail").slideUp("slow");
        $(".addFeeDetail").slideUp("slow");
        $("#addFeeDetail").slideDown("slow");
    });

    $("#cancelRate").click(function () {
        $(".addRateDetail").slideUp("slow");
        $("#addRateDetail").slideDown("slow");
    });

    $("#addPOIDetail").click(function () {
        $(".addPOIDetail").slideDown("slow");
        $("#addPOIDetail").slideUp("slow");
       
    });

    $("#cancelPOI").click(function () {
        $(".addPOIDetail").slideUp("slow");
        $("#addPOIDetail").slideDown("slow");
    });

    $("#deactivateLink").click(function () {

        var myId = $("#listingId").val();
        var user = getCookie("simpleAuth");

        var txt;
        var r = confirm("Are you sure you want to deactivate?");
        if (r == true) {
            var data = JSON.stringify({ id: myId, table: "listings", field: "status", value: "Inactive", user: user });
            UpdateListing(data);

            setTimeout(function () {
                window.location = "dashboard.html";
                SaveNotification("Listing Deactivated!");
            }, 500);
        } else {
            //do nothing . . .
        }

       
       
    });

    $("#insertBathroom").click(function () {
        var id = $("#unitId").val();
        var title = $("#bathroomTitle").val();
        var desc = $("#bathroomDescription").val();
        var user = getCookie("simpleAuth");
        var amenities = "";
        var type = $("#bathroomType").val();
       

        $('.amenityBathroom div input').each(function (i) {
            var id = this.id;
            if (this.checked == true) {
                amenities = amenities + id.replace('bathAmen_', '') + ',';
            }
        });
        //TODO: Validation
        AddNewBathroom(user, id, title, desc, amenities, type);
    });

    $("#insertBedroom").click(function () {
        var id = $("#unitId").val();
        var title = $("#bedroomTitle").val();
        var desc = $("#bedroomDescription").val();
        var user = getCookie("simpleAuth");
        var amenities = "";
        var bedKing = $("#bedKing").val();
        var bedQueen = $("#bedQueen").val();
        var bedDouble = $("#bedDouble").val();
        var bedTwin = $("#bedTwin").val();
        var bedBunk = $("#bedBunk").val();
        var bedChild = $("#bedChild").val();
        var bedFuton = $("#bedFuton").val();
        var bedMurphy = $("#bedMurphy").val();
        var bedCrib = $("#bedCrib").val();
        var bedType = $("#bedroomType").val();

        $('.amenityBedroom div input').each(function (i) {

            var id = this.id;
            if (this.checked == true) {
                amenities = amenities + id.replace('bedAmen_','') + ',';
            }
            
        });
        

        //TODO: Validation
        AddNewBedroom(user, id, title, desc, amenities, bedKing, bedQueen, bedDouble, bedTwin, bedBunk, bedChild, bedFuton, bedMurphy, bedCrib,bedType);
    });

    $("#insertFee").click(function () {
        var id = $("#unitId").val();
        var type = $("#listingFeeType").val();
        var amount = $("#listingFeeAmount").val();
        var user = getCookie("simpleAuth");
        var errMsg = "";

        var errorTemplate = ' <div class="form-group col-sm-4 col-xs-12"><div class="alert alert-danger fade in alert-dismissable">' +
    '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
    '**ERROR_MESSAGE_REPLACE**' +
    '</div></div>';


        if (type == "" || type == "0") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Fee Type is required.<br/>");
            $("#listingFeeType").addClass("error");
        } else {
            $("#listingFeeType").removeClass("error");
        }

        if (amount == "" || amount == "0") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Fee Amount is required.<br/>");
            $("#listingFeeAmount").addClass("error");
        } else {
            $("#listingFeeAmount").removeClass("error");
        }

        if (errMsg == "") {
            $("#errMsgFees").css("display", "none");
            AddNewFee(user, id, type, amount);
        } else {
            //show error message
            $("#errMsgFees").html(errMsg);
            $("#errMsgFees").css("display", "inline");
        }

    });
    
    $("#insertRate").click(function () {
        var id = $("#unitId").val();
        var type = $("#rateType").val();
        var amount = $("#rateAmount").val();
        var start = $("#rateStartDate").val();
        var end = $("#rateEndDate").val();
        var minStay = $("#rateMinStay").val();
        // var maxStay = $("#rateMaxStay").val();
        var cancelPolicy = "60";

       
        cancelPolicy = $('input[name=optCancel]:checked').val();

        if ($("#cp60").is(':checked')) {
            cancelPolicy = "60";
        }
        if ($("#cp90").is(':checked')) {
            cancelPolicy = "90";
        }
        if ($("#cp120").is(':checked')) {
            cancelPolicy = "120";
        }

        var user = getCookie("simpleAuth");
        var errMsg = "";

        var errorTemplate = ' <div class="form-group col-sm-4 col-xs-12"><div class="alert alert-danger fade in alert-dismissable">' +
    '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
    '**ERROR_MESSAGE_REPLACE**' +
    '</div></div>';


        if (type == "" || type == "0") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Rate Type is required.<br/>");
            $("#rateType").addClass("error");
        } else {
            $("#rateType").removeClass("error");
        }

        if (amount == "" || amount == "0") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Rate Amount is required.<br/>");
            $("#rateAmount").addClass("error");
        } else {
            $("#rateAmount").removeClass("error");
        }
        var sDate = "";
        var eDate = "";
        if (start !== "") {
            var stArr = start.split("/");
            if (stArr.length = 3) {
                sDate = new Date(stArr[0] + "/" + stArr[1] + "/" + stArr[2]);
                start = stArr[0] + "/" + stArr[1] + "/" + stArr[2];
            } else {
                sDate = "Invalid";
            }
        }

        if (end !== "") {
            var enArr = end.split("/");
            if (enArr.length = 3) {
                eDate = new Date(enArr[0] + "/" + enArr[1] + "/" + enArr[2]);
                end = enArr[0] + "/" + enArr[1] + "/" + enArr[2];
            } else {
                eDate = "Invalid";
            }
        }

        

        if (sDate == "Invalid" ) {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Invalid Start Date mm/dd/yyY.<br/>");
            $("#rateStartDate").addClass("error");
        }

        if (eDate == "Invalid") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Invalid End Date mm/dd/yyY.<br/>");
            $("#rateEndDate").addClass("error");
        }

        if ((eDate - sDate <= 0) && (eDate !== "" && sDate !== "")) {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Start Date <= End Date.<br/>");
            $("#rateStartDate").addClass("error");
            $("#rateEndDate").addClass("error");
        }

        /* if (start == "" || start == "0") {
             errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Start Date is required.<br/>");
             $("#rateStartDate").addClass("error");
         } else {
             $("#rateStartDate").removeClass("error");
         }
 
         if (end == "" || end == "0") {
             errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "End Date is required.<br/>");
             $("#rateEndDate").addClass("error");
         } else {
             $("#rateEndDate").removeClass("error");
         }
         */

        if (minStay == "" || minStay == "0") {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Minimum Stay is required.<br/>");
            $("#rateMinStay").addClass("error");
        } else {
            $("#rateMinStay").removeClass("error");
        }

        if (errMsg == "") {
            $("#errMsgRates").css("display", "none");
            AddNewRate(user, id, type, amount, start, end, minStay, cancelPolicy);
        } else {
            //show error message
            $("#errMsgRates").html(errMsg);
            $("#errMsgRates").css("display", "inline");
        }

    });

    $("#addWebsiteDetail").click(function () {
        $(".addWebsiteDetail").slideDown("slow");
        $("#addWebsiteDetail").slideUp("slow");
    });

    $("#cancelWebsite").click(function () {
        $(".addWebsiteDetail").slideUp("slow");
        $("#addWebsiteDetail").slideDown("slow");
    });

    $("#insertWebsite").click(function () {
        var id = $("#unitId").val();
        var title = $("#websiteTitle").val();
        var url = $("#websiteURL").val();
        var user = getCookie("simpleAuth");
         AddNewWebsite(user, id, title, url);
    });

    $("#insertPOI").click(function() {
        var id = $("#unitId").val();
        var title = $("#poiTitle").val();
        var user = getCookie("simpleAuth");
        AddNewPOI(user, id, title);
    });

    
    Dropzone.autoDiscover = false;
    //Simple Dropzonejs 
    $("#dZUpload").dropzone({
        url: "listings_FileUpload.ashx",
        addRemoveLinks: false,
        success: function (file, response) {
            var imgName = response;
            var myId = $("#unitId").val();
            UpdateListingPicture(myId, imgName);
            $("#imageName").html(imgName);
            
            file.previewElement.classList.add("dz-success");
            console.log("Successfully uploaded :" + imgName);
        },
        error: function (file, response) {
            file.previewElement.classList.add("dz-error");
        }
    });


    $("#reservationSameAsOwner").click(function () {

        if ($(this).prop("checked")) {
            $("#reservationFName").val("SAMEAS");
            $("#reservationLName").val("OWNER");
            $("#reservationPhone").val("");
            $("#reservationEmail").val("");
            $("#reservationCompany").val("");

            $("#resInfo").css("display","none");        
        } else {
            $("#reservationFName").val("");
            $("#reservationLName").val("");
            $("#reservationPhone").val("");
            $("#reservationEmail").val("");
            $("#reservationCompany").val("");
            $("#resInfo").css("display", "inline");
        }

    });

    $("#conciergeSameAsOwner").click(function () {

        if ($(this).prop("checked")) {

            $("#conciergeFName").val("SAMEAS");
            $("#conciergeLName").val("OWNER");
            $("#conciergePhone").val("");
            $("#conciergeEmail").val("");
            $("#conciergeCompany").val("");
            $("#concInfo").css("display", "none");
        } else {
            $("#conciergeFName").val("");
            $("#conciergeLName").val("");
            $("#conciergePhone").val("");
            $("#conciergeEmail").val("");
            $("#conciergeCompany").val("");
            $("#concInfo").css("display", "inline");
        }

    });

}



function GetGeoSubDivsionByParent(parentId, ddId) {

    var data = "{parentId:" + parentId + "}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetGeoSubDivisionByParent",
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

            if (ddId == 1) {
                $("#geoSubDivision2").empty();
                $("#geoSubDivision2").append('<option value="" >Select Region</option>');

                $("#geoSubDivision3").empty();
                $("#geoSubDivision3").append('<option value="" >Select Area</option>');
                $("#geoSubDivision3").prop("disabled", true);
            }
            if (ddId == 2) {
                $("#geoSubDivision3").empty();
                $("#geoSubDivision3").append('<option value="" >Select Area</option>');
                $("#geoSubDivision3").prop("disabled", false);
            }

            if (msg != undefined) {
                for (var i = 0; i < msg.length; i++) {

                    if (ddId == 1) {
                        $("#geoSubDivision2").append('<option value="' + msg[i].gsdId + '" > ' + msg[i].title + '</option>');
                    }
                    if (ddId == 2) {
                        $("#geoSubDivision3").append('<option value="' + msg[i].gsdId + '" > ' + msg[i].title + '</option>');
                    }
                    
                }
               
            }
            var gs1 = $("#geoSubDivision1").val();
            var gs2 = $("#geoSubDivision2").val();
            var gs3 = $("#geoSubDivision3").val();

            $("#myGeoBreakdown").val(gs1 + "|" + gs2 + "|" + gs3);
           // ValidateControl($("#myGeoBreakdown").val());

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
    
}

function UpdateListingPicture(listingId, imgName) {

    var data = "{listingId:'" + listingId + "', imgName:'" + imgName + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/UpdateListingPicture",
        data: data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        beforeSend: function() {
            $("#greyform").fadeTo(50, 0.8);
            $("#loader").fadeTo(0, 1);
        },
        complete: function() {
            $("#greyform").hide();
            $("#loader").hide();
        },
        success: function(msg) {
            var tc = msg.sequenceNumber;
            //GetListingPictures();
            SaveNotification("Picture Updated!");
        },
        error: function(msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}


function GetListingPictures() {

    var lid = $("#unitId").val();
    
    var data = "{listingId:'" + lid + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingPictures",
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
            DisplayPicturesOnScreen(lid,msg);

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

$(document).on("click", ".amenityCheck", function (event) {
    //special case for kitchen - fully equipped
    if (this.id == "326") {
        if ($(this).prop("checked")) {
            
            RemoveKitchenAmenities();
        } else {
           
            AddKitchenAmenities();
        }
    }

    if ($(this).prop("checked")) {
        $("#" + this.id + "-div").addClass("p-success");
        AddAmenityToListing(this.id);
    } else {
        $("#" + this.id + "-div").removeClass("p-success");
        RemoveAmenityFromListing(this.id);
    }

    ValidateAmenities();
});

function RemoveKitchenAmenities() {
    $("#29").prop("checked", false);
    $("#29-div").removeClass("p-success");
    RemoveAmenityFromListing(29);

    $("#73").prop("checked", false);
    $("#73-div").removeClass("p-success");
    RemoveAmenityFromListing(73);

    $("#74").prop("checked", false);
    $("#74-div").removeClass("p-success");
    RemoveAmenityFromListing(74);

    $("#75").prop("checked", false);
    $("#75-div").removeClass("p-success");
    RemoveAmenityFromListing(75);

    $("#76").prop("checked", false);
    $("#76-div").removeClass("p-success");
    RemoveAmenityFromListing(76);

    $("#77").prop("checked", false);
    $("#77-div").removeClass("p-success");
    RemoveAmenityFromListing(77);

    $("#78").prop("checked", false);
    $("#78-div").removeClass("p-success");
    RemoveAmenityFromListing(78);

    $("#79").prop("checked", false);
    $("#79-div").removeClass("p-success");
    RemoveAmenityFromListing(79);

    $("#80").prop("checked", false);
    $("#80-div").removeClass("p-success");
    RemoveAmenityFromListing(80);

    $("#81").prop("checked", false);
    $("#81-div").removeClass("p-success");
    RemoveAmenityFromListing(81);
   
}

function AddKitchenAmenities() {
    $("#29").prop("checked", true);
    $("#29-div").addClass("p-success");
    AddAmenityToListing(29);

    $("#73").prop("checked", true);
    $("#73-div").addClass("p-success");
    AddAmenityToListing(73);

    $("#74").prop("checked", true);
    $("#74-div").addClass("p-success");
    AddAmenityToListing(74);

    $("#75").prop("checked", true);
    $("#75-div").addClass("p-success");
    AddAmenityToListing(75);

    $("#76").prop("checked", true);
    $("#76-div").addClass("p-success");
    AddAmenityToListing(76);

    $("#77").prop("checked", true);
    $("#77-div").addClass("p-success");
    AddAmenityToListing(77);

    $("#78").prop("checked", true);
    $("#78-div").addClass("p-success");
    AddAmenityToListing(78);

    $("#79").prop("checked", true);
    $("#79-div").addClass("p-success");
    AddAmenityToListing(79);

    $("#80").prop("checked", true);
    $("#80-div").addClass("p-success");
    AddAmenityToListing(80);

    $("#81").prop("checked", true);
    $("#81-div").addClass("p-success");
    AddAmenityToListing(81);
    
}

function DownloadPictures() {
    var myId = $("#unitId").val();

    var data = "{listingId:'" + myId + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/ZipAndArchive",
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
            var tc = msg.downloadPath;
            //var path = tc.replaceAll("\\", "/");
            //alert(tc);
            //window.open(window.location.protocol + "//" + window.location.host + path);
            //set link
            $("#zipPicLink").attr("href", tc);
            //show new link
            $("#downloadPicturesNow").css("display", "inline-block");
            $("#downloadPictures").css("display", "none");
            SaveNotification("Pictures Availalbe for Download!");

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function AddNewRate(user, id, type, amount, start, end, minStay, cancelPolicy) {

    var data = "{userid:'" + user + "',listingId:'" + id + "', type:'" + type + "',amount:'" + amount + "', startDate:'" + start + "', endDate:'" + end + "', minStay:'" + minStay + "', cancelPolicy:'" + cancelPolicy + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/AddNewRate",
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
            GetListingRates(id,"USD");
            $(".addRateDetail").slideUp("slow");
            $("#addRateDetail").slideDown("slow");
            SaveNotification("New Rate Added!");
            ClearRates();
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
    
}

function ClearRates() {
    $("#rateType").val("");
    $("#rateAmount").val("");
    $("#rateStartDate").val("");
    $("#rateEndDate").val("");
    $("#rateMinStay").val("");
}

function AddNewFee(user, id, type,amount)
{

    var data = "{userid:'" + user + "',listingId:'" + id + "', type:'" + type + "',amount:'" + amount + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/AddNewFee",
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
            GetListingFees(id);

            $("#listingFeeAmount").val("");
            $(".addFeeDetail").slideUp("slow");
            $("#addFeeDetail").slideDown("slow");
            SaveNotification("New Fee Added!");
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function GetListingRates(id,currType) {
    var listingId = id;
    var data = "{listingId:'" + listingId + "',currType:'" + currType + "'}";
    $.ajax({
        type: "POST",
        data: data,
        url: "/Home/GetListingRates",
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

            var myRates = tc;

            var lastRateDate = "";
            var sDate = "";
            var eDate = "";

            if (myRates !== undefined) {
                var displayRates = "<h2>Rates</h2>";
                var alt = "";
                $("#rateCount").val(myRates.length);

                displayRates = displayRates + '<div class="row header">' +
                    '<div class="col-md-1 col-sm-6 col-xs-12">&nbsp;</div>' +
                    '<div class="col-md-2 col-sm-6 col-xs-12" style="font-weight:700">Type</div>' +
                    '<div class="col-md-2 col-sm-6 col-xs-12" style="font-weight:700">Amount</div>' +
                    '<div class="col-md-2 col-sm-6 col-xs-12" style="font-weight:700">Start Date</div>' +
                    '<div class="col-md-2 col-sm-6 col-xs-12" style="font-weight:700">End Date</div>' +
                    '<div class="col-md-1 col-sm-6 col-xs-12" style="font-weight:700">Min Stay</div>' +
                    '<div class="col-md-2 col-sm-6 col-xs-12" style="font-weight:700">Cancellation Policy</div></div>';



                for (var j = 0; j < myRates.length; j++) {

                    var xx = j % 2;
                    if (xx == 0) {
                        alt = "altRow";
                    } else {
                        alt = "";
                    }
                    sDate = myRates[j].startDate;
                    if (sDate == "Jan 01, 1900") {
                        sDate = "";
                    }
                    eDate = myRates[j].endDate;
                    if (eDate == "Jan 01, 1900") {
                        eDate = "";
                    }
                    displayRates = displayRates + '<div style="color:black;" class="row ' + alt + '">' +
                        '<div class="col-md-1 col-sm-6 col-xs-12"><span class="rateRemove" style="cursor:pointer" id="delRate-' + myRates[j].rateId + '">X</span><a style="float:right" class="editRates" href="#" id="editRate-' + myRates[j].rateId + '">(Edit)</a></div>' +
                        '<div class="col-md-2 col-sm-6 col-xs-12 rowStyle" >' + myRates[j].rateType + '</div>' +
                        //'<div class="col-md-2 col-sm-6 col-xs-12 rowStyle">' + "$" + Number(myRates[j].rateAmount).toLocaleString('en').replace(".00", "") + '</div>' +
                        '<div class="col-md-2 col-sm-6 col-xs-12 rowStyle">' + "$" + Number(myRates[j].rateAmount).toLocaleString('en') + '</div>' +
                        '<div class="col-md-2 col-sm-6 col-xs-12 rowStyle">' + sDate + '</div>' +
                        '<div class="col-md-2 col-sm-6 col-xs-12 rowStyle">' + eDate + '</div>' +
                        '<div class="col-md-1 col-sm-6 col-xs-12 rowStyle">' + myRates[j].minStay + '</div>' +
                        '<div class="col-md-2 col-sm-6 col-xs-12 rowStyle">' + myRates[j].cancelDays + ' days</div></div>';
                    //BlockOutRateDates(myRates[j].startDate, myRates[j].endDate);

                    lastRateDate = myRates[j].endDate;

                }

                $("#rateListing").html(displayRates);
                $("#rateStartDate").datepicker({
                    beforeShowDay: function (date) {
                        //var dateArray = getDates(new Date(sDate), new Date(eDate));
                        //rateateArray.concat(dateArray);
                        var string = jQuery.datepicker.formatDate('mm/dd/yy', date);
                        return [rateDateArray.indexOf(string) == -1];
                    },
                    minDate: new Date(),
                    dateFormat: 'mm/dd/yy',
                    changeMonth: true, changeYear: true
                });

                $("#e_rateStartDate").datepicker({
                    onSelect: function (date) {

                        var myDate = new Date($("#rateStartDate").val());
                        var endDate = myDate.setMonth(myDate.getMonth() + 1);
                        $("#e_rateStartDate").datepicker("option", "minDate", new Date(endDate));
                    },
                    beforeShowDay: function (date) {
                        //var dateArray = getDates(new Date(sDate), new Date(eDate));
                        //rateateArray.concat(dateArray);
                        var string = jQuery.datepicker.formatDate('mm/dd/yy', date);
                        return [rateDateArray.indexOf(string) == -1];
                    },
                    minDate: new Date(),
                    dateFormat: 'mm/dd/yy',
                    changeMonth: true, changeYear: true
                });

                var myDate = new Date(lastRateDate);
            var endDate = myDate.setMonth(myDate.getMonth() + 1);
                $("#rateEndDate").datepicker({
                    beforeShowDay: function (date) {
                        //var dateArray = getDates(new Date(sDate), new Date(eDate));
                        //rateDateArray.concat(dateArray);
                        var string = jQuery.datepicker.formatDate('mm/dd/yy', date);
                        return [rateDateArray.indexOf(string) == -1];
                    },
                    minDate: new Date(),
                    dateFormat: 'mm/dd/yy',
                    changeMonth: true, changeYear: true
                });
                $("#e_rateEndDate").datepicker({
                    beforeShowDay: function (date) {
                        //var dateArray = getDates(new Date(sDate), new Date(eDate));
                        //rateDateArray.concat(dateArray);
                        var string = jQuery.datepicker.formatDate('mm/dd/yy', date);
                        return [rateDateArray.indexOf(string) == -1];
                    },
                    minDate: new Date(),
                    dateFormat: 'mm/dd/yy',
                    changeMonth: true, changeYear: true
                });

                $(document).on("click", ".rateRemove", function (event) {
                    DeleteRate(this.id);
                });

                $(document).on("click", ".editRates", function (event) {
                    EditRate(this.id);
                });

                
            }
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function EditRate(rateId) {
    rateId = rateId.replace("editRate-", "");
    $("#editRateId").val(rateId);
    //alert(rateId);

    $("#editRates").css("display", "inline");
    $("#grayout").css("display", "inline");
    GetRateDetails(rateId);
}

function EditFee(feeId) {
    feeId = feeId.replace("editFee-", "");
    $("#editFeeId").val(feeId);
    //alert(rateId);

    $("#editFees").css("display", "inline");
    $("#grayout").css("display", "inline");
    GetFeeDetails(feeId);
}

function GetFeeDetails(feeId) {
     var listingId = $("#unitId").val();

    //TODO: add more to this!!
     var data = "{listingId:'" + listingId + "',feeId:'" + feeId + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/EliteAdmin/GetFeeInfo",
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

            $("#e_listingFeeType").val(tc.feeType);
            $("#e_feeAmount").val(tc.feeAmount);
           
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function GetRateDetails(rateId) {
   var listingId = $("#unitId").val();

    //TODO: add more to this!!
    var data = "{listingId:'" + listingId + "',rateId:'" + rateId + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/EliteAdmin/GetRateInfo",
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
           
            //for (var i = 0; i < tc.length; i++) {

            $("#e_rateType").val(tc.rateType);
            $("#e_rateAmount").val(tc.rateAmount);

            var sDate = tc.startDate;
            var eDate = tc.endDate;
            if (sDate !== "") {
                var sAr = sDate.split("/");
                sDate = sAr[0] + "/" + sAr[1] + "/" + sAr[2];
            }
            if (eDate !== "") {
                var eAr = eDate.split("/");
                eDate = eAr[0] + "/" + eAr[1] + "/" + eAr[2];
            }
            $("#e_rateStartDate").val(sDate);
            $("#e_rateEndDate").val(eDate);
            $("#e_rateMinStay").val(tc.minStay);

            if (tc.cancelDays == "60") {
                $("#e_cp60").prop("checked", "checked");
            }
            if (tc.cancelDays == "90") {
                $("#e_cp90").prop("checked", "checked");
            }
            if (tc.cancelDays == "120") {
                $("#e_cp120").prop("checked", "checked");
            }

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function GetListingFees(id)
{
    var listingId = $("#unitId").val();
    var data = "{listingId:'" + listingId + "'}";
    $.ajax({
        type: "POST",
        data: data,
        url: "/Home/GetListingFees",
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

            var myFees = tc;

            if (myFees != undefined) {
                var displayFees = "<h2>Fees</h2>";
                var alt = "";
                $("#feeCount").val(myFees.length);

                displayFees = displayFees + '<div class="row header">' +
                   '<div class="col-md-2 col-sm-1 col-xs-12">&nbsp;</div>' +
                   '<div class="col-md-2 col-sm-1 col-xs-12">&nbsp;</div>' +
                   '<div class="col-md-4 col-sm-5 col-xs-12" style="font-weight:700">Type</div>' +
                   '<div class="col-md-4 col-sm-6 col-xs-12" style="font-weight:700">Amount</div></div>';

                for (var i = 0; i < myFees.length; i++) {
                    var xx = i % 2;
                    if (xx == 0) {
                        alt = "altRow";
                    } else {
                        alt = "";
                    }
                    displayFees = displayFees + '<div style="color:black;" class="row ' + alt + '">' +
                        '<div class="col-md-2 col-sm-1 col-xs-12"><span class="feeRemove" style="cursor:pointer" id="delFee-' + myFees[i].feeId + '">X</span></div>' +
                        '<div class="col-md-2 col-sm-1 col-xs-12"><a class="editFee" style="cursor:pointer" id="editFee-' + myFees[i].feeId + '">(Edit)</a></div>' +
                        '<div class="col-md-4 col-sm-5 col-xs-12 rowStyle" >' + myFees[i].feeType + '</div>' +
                        '<div class="col-md-4 col-sm-6 col-xs-12 rowStyle">' + "$" + Number(myFees[i].feeAmount).toLocaleString('en').replace(".00", "") + '</div></div>';
                }

                $("#feeListing").html(displayFees);

                $(document).on("click", ".feeRemove", function (event) {
                    DeleteFee(this.id);
                });

                $(".editFee").click(function () {
                    $("#grayout").css("display", "inline");
                    $("#editFee").css("display", "inline");
                    EditFee(this.id);
                });
            }
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function initMap() {

    var myLat = parseFloat($("#lat").val());
    var myLng = parseFloat($("#lng").val());
    var myLatLng = { lat: myLat, lng: myLng };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 32,
        center: myLatLng,
        styles: mapStyles,
        mapTypeId: 'hybrid'
    });

    var image = '../../img/map/marker.png';
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image
    });

}


function ValidateControl(control) {

    var $this = control;
    window.currentControl = $this;
    var thisId = $this.attr("id");
    var thisVal = document.getElementById($this.attr("id")).value;
    
    var saveData = true;

    $this.addClass("success");
    //setTimeout(function () { $this.removeClass("success"); }, 2000);

    setTimeout(function() {
        $this.css("border-color", "#e5e5e5");
        $this.css("border", ".5px solid #e5e5e5");
    }, 1500);

    setTimeout(function () {
        $this.removeClass("success");
    }, 2000);
 
}

function ValidateAllTheThings() {
    var aboutVal = ValidateAbout();
    var addrVal = ValidateAddress();
    var ownVal = ValidateOwner();
    if (aboutVal) {
        $(".aboutLi").removeClass("errorTitle");
    } else {
        $(".aboutLi").addClass("errorTitle");
    }
    if (addrVal) {
        $(".addLi").removeClass("errorTitle");
    } else {
        $(".addLi").addClass("errorTitle");
    }
    if (ownVal) {
        $(".ownLi").removeClass("errorTitle");
    } else {
        $(".ownLi").addClass("errorTitle");
    }

    ValidateBedAndBath();
    ValidateRatesAndFees();
    ValidatePictures();

    setTimeout(function () {
        CheckIfComplete();
    }, 1000);
    
}

function CheckIfComplete() {
    var incomplete = 0;
    if ($(".aboutLi").hasClass("errorTitle")) {
        incomplete = incomplete + 1;
    }
    if ($(".addLi").hasClass("errorTitle")) {
        incomplete = incomplete + 1;
    }
    if ($(".amenLi").hasClass("errorTitle")) {
        incomplete = incomplete + 1;
    }
    if ($(".ownLi").hasClass("errorTitle")) {
        incomplete = incomplete + 1;
    }
    if ($(".bedLi").hasClass("errorTitle")) {
        incomplete = incomplete + 1;
    }
    if ($(".rateLi").hasClass("errorTitle")) {
        incomplete = incomplete + 1;
    }
    if ($(".picLi").hasClass("errorTitle")) {
        incomplete = incomplete + 1;
    }
   
    var listStatus = $("#listingStatus").val();

    //if (incomplete == 0 && listStatus == "Incomplete") {
        //SaveNotification("Listing is now complete, status updated to Pending.  You can now set this listing to active!");
        //alert("Listing is now complete, status updated to Pending.  You can now set this listing to active!");
        //$("#listingStatus").val("Pending");
        //$("#listingStatus option[value='Active']").attr("disabled", false);
        //$("#listingStatus option[value='Ghost']").attr("disabled", false);
        //$("#listingStatus option[value='Pending']").attr("disabled", false);

       
        //ValidateControl($("#listingStatus"));
    //}

    if (incomplete == 0) {
        $("#listingSummary").html("<h3>" + $("#listingBeds").val() + " Beds, " + $("#listingBaths").val() + " Baths - located in " + $("#listingCity").val() + ", " + $("#listingState").val() + "(" + $("#listingCountry").val() + ")" + "</h3>");
    }

}

function ValidateAbout() {

    var isValid = false;
    var errMsg = "";

    var headline = $("#listingTitle").val();
    var propName = $("#listingPropertyName").val();
    var status = $("#listingStatus").val();
    //    var category = $("#sbHolder_" + $("#listingCategory").attr("sb")).val();
    var category = $("#listingCategory").val();
    var sqFt = $("#listingSqFt").val();
    var maxOccupancy = $("#listingMaxOccupancy").val();
    var featured = "";//TODO:checkbox for featured properties
    var desc = $("#listingDescription").val();
    var view = $("#listingView").val();
    var beds = $("#listingBeds").val();
    var baths = $("#listingBaths").val();

    var errorTemplate = ' <div class="form-group col-sm-4 col-xs-12"><div class="alert alert-danger fade in alert-dismissable">' +
    '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
    '**ERROR_MESSAGE_REPLACE**' +
    '</div></div>';

    if (headline == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Headline is required.<br/>");
        $("#listingTitle").addClass("error");
    } else {
        $("#listingTitle").removeClass("error");
    }

    if (propName == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Property Name is required.<br/>");
        $("#listingPropertyName").addClass("error");
    } else {
        $("#listingPropertyName").removeClass("error");
    }

    if (status == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Status is required.<br/>");
        $("#listingStatus").addClass("error");
    } else {
        $("#listingStatus").removeClass("error");
    }



    if (category == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Category is required.<br/>");
        $("#listingCategory").addClass("error");
    } else {
        $("#listingCategory").removeClass("error");
    }

    /*if (sqFt == ""||sqFt=="0") {
        errMsg = errMsg + "Property Sq. Ft. is required.<br/>";
        $("#listingSqFt").addClass("error");
    } else {
        $("#listingSqFt").removeClass("error");
    }*/

    if (maxOccupancy == "" || maxOccupancy == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Max Occupancy is required.<br/>");
        $("#listingMaxOccupancy").addClass("error");
    } else {
        $("#listingMaxOccupancy").removeClass("error");
    }

    if (desc == "" ) {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Description is required.<br/>");
        $("#listingDescription").addClass("error");
    } else {
        $("#listingDescription").removeClass("error");
    }

    if (view == "" || view == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "View is required.<br/>");
        $("#listingView").addClass("error");
    } else {
        $("#listingView").removeClass("error");
    }

    //listingBeds //listingBaths

    if (beds == "" || beds == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "# of Bedrooms is required.<br/>");
        $("#listingBeds").addClass("error");
    } else {
        $("#listingBeds").removeClass("error");
    }

    if (baths == "" || baths == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "# of Bathrooms is required.<br/>");
        $("#listingBaths").addClass("error");
    } else {
        $("#listingBaths").removeClass("error");
    }


    if (errMsg == "") {
        isValid = true;
        $("#errMsgAbout").css("display", "none");
    } else {
        //show error message
        isValid = false;
        $("#errMsgAbout").html(errMsg);
        $("#errMsgAbout").css("display", "inline");
    }


    return isValid;
}

function ValidateAddress() {

    var isValid = true;
    var errMsg = "";
    var add1 = $("#listingAddress").val();
   // var add2 = $("#listingAddress2").val();
    var country = $("#listingCountry").val();
    var city = $("#listingCity").val();
    var state = $("#listingState").val();
    var zip = $("#listingPostal").val();
    var lat = $("#listingLatitude").val();
    var lng = $("#listingLongitude").val();
    var curr = $("#listingBaseCurrency").val();
    var tax = $("#listingTaxPercentage").val();
    var svc = $("#listingServiceFee").val();

    var errorTemplate = ' <div class="form-group col-sm-4 col-xs-12"><div class="alert alert-danger fade in alert-dismissable">' +
   '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
   '**ERROR_MESSAGE_REPLACE**' +
   '</div></div>';

    if (add1 == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Address is required.<br/>");
        $("#listingAddress").addClass("error");
    } else {
        $("#listingAddress").removeClass("error");
    }

    //TODO: reload states based on country selection
    if (country == "" || country == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Country is required.<br/>");
        $("#listingCountry").addClass("error");
    } else {
        $("#listingCountry").removeClass("error");
    }

    if (city == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "City is required.<br/>");
        $("#listingCity").addClass("error");
    } else {
        $("#listingCity").removeClass("error");
    }

    /*
    if (state == "" || state == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "State is required.<br/>");
        $("#listingState").addClass("error");
    } else {
        $("#listingStae").removeClass("error");
    }
    

    //TODO: Only for USA AND CAN
    //TODO:additional validation for zip US & postal CAN
    if (zip == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Zip/Postal is required.<br/>");
        $("#listingPostal").addClass("error");
    } else {
        $("#listingPostal").removeClass("error");
    }
*/

    var latReg = new RegExp("^-?([1-8]?[1-9]|[1-9]0)\.{1}\d{1,6}");
    var lngReg = new RegExp("^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\.{1}\d{1,6}");


    if (lat == "" || lat == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Latitude is required.<br/>");
        $("#listingLatitude").addClass("error");
    } else {
        if (lat >= -90 && lat <= 90 && parseFloat(lat)) {
            $("#listingLatitude").removeClass("error");
        } else {

            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Invalid Latitude.<br/>");
            $("#listingLatitude").addClass("error");
        }
    }


    if (lng == "" || lng == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Longitude is required.<br/>");
        $("#listingLongitude").addClass("error");
    } else {
        if (lng >= -180 && lng <= 180 && parseFloat(lng)) {
            $("#listingLongitude").removeClass("error");
        } else {

            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Invalid Longitude.<br/>");
            $("#listingLongitude").addClass("error");
        }
    }


    

    if (curr == "" || curr == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Currency is required.<br/>");
        $("#listingBaseCurrency").addClass("error");
    } else {
        $("#listingBaseCurrency").removeClass("error");
    }

    if (tax !== "") {
        var isFloat = CheckIfFloat(tax, 0, 100);
        if (!isFloat) {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Tax is invalid.<br/>");
            $("#listingTaxPercentage").addClass("error");
        } else {
            $("#listingTaxPercentage").removeClass("error");
        }
    }

    if (tax !== "") {
        var isFloat = CheckIfFloat(tax, 0, 100);
        if (!isFloat) {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Tax is invalid.<br/>");
            $("#listingTaxPercentage").addClass("error");
        } else {
            $("#listingTaxPercentage").removeClass("error");
        }
    }

    if (svc !== "") {
        var isFloat = CheckIfFloat(svc, 0, 100);
        if (!isFloat) {
            errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Service % is invalid.<br/>");
            $("#listingServiceFee").addClass("error");
        } else {
            $("#listingServiceFee").removeClass("error");
        }
    }
    
    /*
    if (tax == "" || tax == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Tax Percentage is required.<br/>");
        $("#listingTaxPercentage").addClass("error");
    } else {
        $("#listingTaxPercentage").removeClass("error");
    }
    */

    
    if (errMsg == "") {
        isValid = true;
        $("#errMsgAddress").css("display", "none");
    } else {
        //show error message
        isValid = false;
        $("#errMsgAddress").html(errMsg);
        $("#errMsgAddress").css("display", "inline");
    }


    return isValid;
}

function ValidateAmenities() {
    var ct = $("#amenityCount").val();
    if (ct=="0") {
        $(".amenLi").addClass("errorTitle");
    } else {
        $(".amenLi").removeClass("errorTitle");
    }
}

function ValidateBedAndBath() {

    var bedsAbout = $("#listingBeds").val();
    var bathsAbout = $("#listingBaths").val();
    var bedsCreated = $("#bedCount").val();
    var bathsCreated = $("#bathCount").val();

    var errorYN = "N";

    var errorTemplate = ' <div class="form-group col-sm-4 col-xs-12"><div class="alert alert-danger fade in alert-dismissable">' +
'<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
'**ERROR_MESSAGE_REPLACE**' +
'</div></div>';

    if (bedsAbout - bedsCreated > 0) {
        $("#bedError").html(errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", bedsAbout - bedsCreated + " bedrooms left to create<br/>"));
        errorYN = "Y";
    } else {
        $("#bedError").html("");
    }

    if (bathsAbout - bathsCreated > 0) {
        $("#bathError").html(errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", bathsAbout - bathsCreated + " bathrooms left to create<br/>"));
        errorYN = "Y";
    } else {
        $("#bathError").html("");
    }


    if (errorYN == "Y") {
        $(".bedLi").addClass("errorTitle");
    } else {
        $(".bedLi").removeClass("errorTitle");
    }


}

function ValidateRatesAndFees() {
    var rates = $("#rateCount").val();
    var fees = $("#feeCount").val();

    if (rates == "0" || fees=="0") {
        $(".rateLi").addClass("errorTitle");
    } else {
        $(".rateLi").removeClass("errorTitle");
    }
}

function ValidatePictures() {
    var ct = $("#pictureCount").val();
    if (ct == "0") {
        $(".picLi").addClass("errorTitle");
        $("#downloadPictures").css("display", "none");
    } else {
        $(".picLi").removeClass("errorTitle");
        $("#downloadPictures").css("display", "inline-block");
    }
}

function ValidateOwner() {
    var isValid = true;
    var errMsg = "";
    var add1 = $("#ownerAddress").val();
    // var add2 = $("#listingAddress2").val();
    var country = $("#ownerCountry").val();
    var city = $("#ownerCity").val();
    var state = $("#ownerState").val();
    var zip = $("#ownerPostal").val();
    var fname = $("#ownerFName").val();
    var lname = $("#ownerLName").val();
    var phone = $("#ownerPhone").val();
    var company = $("#ownerCompany").val();
    var email = $("#ownerEmail").val();
    var comm = $("#ownerCommission").val();
    var agent = $("#ownerAgent").val();
    var rFname = $("#reservationFName").val();
    var rLname = $("#reservationLName").val();
    var rPhone = $("#reservationPhone").val();
    var rEmail = $("#reservationEmail").val();
    var cFname = $("#conciergeFName").val();
    var cLname = $("#conciergeLName").val();
    var cPhone = $("#conciergePhone").val();
    var cEmail = $("#conciergeEmail").val();

    var errorTemplate = ' <div class="form-group col-sm-4 col-xs-12"><div class="alert alert-danger fade in alert-dismissable">' +
 '<a href="#" class="close" data-dismiss="alert" aria-label="close" title="close">×</a>' +
 '**ERROR_MESSAGE_REPLACE**' +
 '</div></div>';

    if (fname == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Owner First Name is required.<br/>");
        $("#ownerFName").addClass("error");
    } else {
        $("#ownerFName").removeClass("error");
    }

    if (lname == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Owner Last Name is required.<br/>");
        $("#ownerLName").addClass("error");
    } else {
        $("#ownerLName").removeClass("error");
    }

    if (phone == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Owner Phone is required.<br/>");
        $("#ownerPhone").addClass("error");
    } else {
        $("#ownerPhone").removeClass("error");
    }

    if (email == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Owner Email is required.<br/>");
        $("#ownerEmail").addClass("error");
    } else {
        $("#ownerEmail").removeClass("error");
    }

   /* if (add1 == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Owner Address is required.<br/>");
        $("#ownerAddress").addClass("error");
    } else {
        $("#ownerAddress").removeClass("error");
    }

    //TODO: reload states based on country selection
    if (country == "" || country == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Owner Country is required.<br/>");
        $("#ownerCountry").addClass("error");
    } else {
        $("#ownerCountry").removeClass("error");
    }

    if (city == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Owner City is required.<br/>");
        $("#ownerCity").addClass("error");
    } else {
        $("#ownerCity").removeClass("error");
    }

    */

    //TODO: only require for US / CAN

    /*
    if (state == "" || state == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Owner State is required.<br/>");
        $("#ownerState").addClass("error");
    } else {
        $("#ownerState").removeClass("error");
    }

    //TODO: Only for USA AND CAN
    //TODO:additional validation for zip US & postal CAN
    if (zip == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Owner Postal is required.<br/>");
        $("#ownerPostal").addClass("error");
    } else {
        $("#ownerPostal").removeClass("error");
    }

    if (comm == "" || comm == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Commission % is required.<br/>");
        $("#ownerCommission").addClass("error");
    } else {
        $("#ownerCommission").removeClass("error");
    }

    if (agent == "" || agent == "0") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Agent is required.<br/>");
        $("#ownerAgent").addClass("error");
    } else {
        $("#ownerAgent").removeClass("error");
    }

    //reservations
    if (rFname == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Reservation First Name is required.<br/>");
        $("#reservationFName").addClass("error");
    } else {
        $("#reservationFName").removeClass("error");
    }

    if (rLname == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Reservation Last Name is required.<br/>");
        $("#reservationLName").addClass("error");
    } else {
        $("#reservationLName").removeClass("error");
    }
    if (rPhone == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Reservation Phone is required.<br/>");
        $("#reservationPhone").addClass("error");
    } else {
        $("#reservationPhone").removeClass("error");
    }

    if (rEmail == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Reservation Email is required.<br/>");
        $("#reservationEmail").addClass("error");
    } else {
        $("#reservationEmail").removeClass("error");
    }

    //concierge
    if (cFname == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Concierge First Name is required.<br/>");
        $("#conciergeFName").addClass("error");
    } else {
        $("#conciergeFName").removeClass("error");
    }

    if (cLname == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Concierge Last Name is required.<br/>");
        $("#conciergeLName").addClass("error");
    } else {
        $("#conciergeLName").removeClass("error");
    }
    if (cPhone == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Concierge Phone is required.<br/>");
        $("#conciergePhone").addClass("error");
    } else {
        $("#conciergePhone").removeClass("error");
    }

    if (cEmail == "") {
        errMsg = errMsg + errorTemplate.replace("**ERROR_MESSAGE_REPLACE**", "Concierge Email is required.<br/>");
        $("#conciergeEmail").addClass("error");
    } else {
        $("#conciergeEmail").removeClass("error");
    }
    
    */

    if (errMsg == "") {
        isValid = true;
        $("#errMsgOwnerAddress").css("display", "none");
    } else {
        //show error message
        isValid = false;
        $("#errMsgOwnerAddress").html(errMsg);
        $("#errMsgOwnerAddress").css("display", "inline");
    }


    return isValid;
    
}

function ShowSection(tab) {


    //check to see if anything needs to be saved.
    if ($("#saveAbout").hasClass("updated")) {
        var r = confirm("Unsaved Changes in About - Click Ok to Save, or Cancel to return.");
        if (r == true) {
            SaveListingAbout();
        } else {
            //return;
        }
        $("#saveAbout").removeClass("updated");
    }

    if ($("#saveLocation").hasClass("updated")) {
        var r = confirm("Unsaved Changes in Location - Click Ok to Save, or Cancel to return.");
        if (r == true) {
            SaveListingLocation();
        } else {
            //return;
        }
        $("#saveLocation").removeClass("updated");
    }

    if ($("#saveOwner").hasClass("updated")) {
        var r = confirm("Unsaved Changes in Owner - Click Ok to Save, or Cancel to return.");
        if (r == true) {
            SaveListingOwner();
        } else {
           // return;
        }
        $("#saveOwner").removeClass("updated");
    }

    $(".addressInfo").css("display", "none");
    $(".amenityInfo").css("display", "none");
    $(".bedroomInfo").css("display", "none");
    $(".rateInfo").css("display", "none");
    $(".pictureInfo").css("display", "none");
    $(".ownerInfo").css("display", "none");
    $(".aboutInfo").css("display", "none");

    $(".addLi").removeClass("active");
    $(".amenLi").removeClass("active");
    $(".bedLi").removeClass("active");
    $(".rateLi").removeClass("active");
    $(".picLi").removeClass("active");
    $(".ownLi").removeClass("active");
    $(".aboutLi").removeClass("active");

    switch (tab) {
        case "address":
            $(".addressInfo").slideDown("slow");
            $(".addLi").addClass("active");
            break;
        case "about":
            $(".aboutInfo").slideDown("slow");
            $(".aboutLi").addClass("active");
            break;
        case "amenity":
            $(".amenityInfo").slideDown("slow");
            $(".amenLi").addClass("active");
            break;
        case "bedroom":
            $(".bedroomInfo").slideDown("slow");
            $(".bedLi").addClass("active");
            break;
        case "rate":
            $(".rateInfo").slideDown("slow");
            $(".rateLi").addClass("active");
            break;
        case "picture":
            $(".pictureInfo").slideDown("slow");
            $(".picLi").addClass("active");
            break;
        case "owner":
            $(".ownerInfo").slideDown("slow");
            $(".ownLi").addClass("active");
            break;
        default:
            $(".addressInfo").slideDown("slow");
            $(".addLi").addClass("active");
            break;
    }

    CheckCompletionStatus();


}

function CheckCompletionStatus() {
    
    //check address info
    //$("#.addLi").css("background-color","red");

    //check count of amenities, if zero, red
    //check count of websites, if zero, red
    //check count of bedrooms, if zero, red
    //check count of rates & fees, if both zero, red, if one or other, then orange?
    //check count of pictures, if zero, red
    //if all green, then show new property status window (formarlly incomplete--> available, ghost, unavail)
}

function AddNewBathroom(user, id, title, desc, amenities, type) {
    var listingId = $("#unitId").val();


   // var data = "{userid:'" + user + "',listingId:'" + listingId + "', title:'" + title + "',desc:'" + desc + "', amenities:'" + amenities + "',type:'" + type + "'}";
    var model = {
        userId: user,
        listingId: listingId,
        title: title,
        desc: desc,
        amenities: amenities,
       type: type 
    };

    $.ajax({
        type: "POST",
        data: JSON.stringify(model),
        url: "/Home/AddNewBathroom",
        //data: data,
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
            GetListingBathrooms(listingId);
            ResetBathrooms();
            $(".addBathroomDetail").slideUp("slow");
            $("#addBathroomDetail").slideDown("slow");
            SaveNotification("New Bathroom Added!");
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function ResetBedrooms() {
    $("#bedroomTitle").val("");
    $("#bedroomDescription").val("");
    $("#bedKing").val("0");
    $("#bedQueen").val("0");
    $("#bedDouble").val("0");
    $("#bedTwin").val("0");
    $("#bedBunk").val("0");
    $("#bedChild").val("0");
    $("#bedFuton").val("0");
    $("#bedMurphy").val("0");
    $("#bedCrib").val("0");
    GetBedroomAmenities();
}

function ResetBathrooms() {
    $("#bathroomTitle").val("");
    $("#bathroomDescription").val("");
    $("#bathroomType").val("0");
    GetBathroomAmenities();
}



function UpdateRate(user, listingId, rateId, type, amount, startDate, endDate, minStay, cancelPolicy) {
    listingId = $("#unitId").val();
    var data = "{userid:'" + user + "',listingId:'" + listingId + "',rateId:'" + rateId + "', rateType:'" + type + "', rateAmount:'" + amount + "', startDate:'" + startDate + "', endDate:'" + endDate + "', minStay:'" + minStay + "', cancelPolicy:'" + cancelPolicy + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/EliteAdmin/UpdateRate",
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
            GetListingRates(listingId,'USD');

            if (tc.error == "") {
                SaveNotification("Rate Information Updated!");
                ResetRates();
                $("#grayout").css("display", "none");
                $("#editRates").css("display", "none");
            } else {
                ErrorNotification(tc.error);
            }
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function UpdateFee(user, listingId, feeId, type, amount) {
    //TODO: Actually update

    listingId = $("#unitId").val();

    //TODO: add more to this!!
    var data = "{userid:'" + user + "',listingId:'" + listingId + "',feeId:'" + feeId + "', feeType:'" + type + "', feeAmount:'" + amount + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/EliteAdmin/UpdateFee",
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
            GetListingFees(listingId);
            ResetFees();
            $("#grayout").css("display", "none");
            $("#editFee").css("display", "none");
            SaveNotification("Fee Information Updated!");
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function ResetFees() {
    $("#e_feeAmount").val("");
    $("#e_listingFeeType").val("");
}

function ResetRates() {
    $("#e_rateType").val("");
    $("#e_rateAmount").val("");
    $("#e_rateStartDate").val("");
    $("#e_rateEndDate").val("");
    $("#e_rateMinStay").val("");

}

function UpdateBathroom(user, listingId, bathroomId, title, desc, amenities, type) {

    listingId = $("#unitId").val();

  
   // var data = "{userid:'" + user + "',listingId:'" + listingId + "',bathroomId:'" + bathroomId + "', title:'" + title + "', type:'" + type + "',desc:'" + desc + "', amenities:'" + amenities + "'}";

    var model = {
        userId: user,
        listingId: listingId,
        bathroomId: bathroomId,
        title: title,
        type: type,
        desc: desc,
        amenities: amenities
    };

    $.ajax({
        type: "POST",
        data: JSON.stringify(model),
        url: "/Home/UpdateBathroom",
        //data: data,
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
            GetListingBathrooms(listingId);
            ResetBathrooms();
            $("#grayout").css("display", "none");
            $("#editBathroom").css("display", "none");
            SaveNotification("Bathroom Information Updated!");
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function UpdateBedroom(user, listingId, bedroomId, title, desc, amenities, bedKing, bedQueen, bedDouble, bedTwin, bedBunk, bedChild, bedFuton, bedMurphy, bedCrib,bedType) {
    
    listingId = $("#unitId").val();

    //TODO: add more to this!!
   // var data = "{userid:'" + user + "',listingId:'" + listingId + "',bedroomId:'" + bedroomId + "', title:'" + title + "',desc:'" + desc + "', amenities:'" + amenities + "', king:'" + bedKing + "',queen:'" + bedQueen + "',doubleBed:'" + bedDouble + "', twin:'" + bedTwin + "',bunk:'" + bedBunk + "',child:'" + bedChild + "',futon:'" + bedFuton + "',murphy:'" + bedMurphy + "',crib:'" + bedCrib + "'}";


    var model = {
        userId: user,
        listingId: listingId,
        bedroomId: bedroomId,
        title: title,
        desc: desc,
        amenities: amenities,
        king: bedKing,
        queen: bedQueen,
        doubleBed: bedDouble,
        twin: bedTwin,
        bunk: bedBunk,
        child: bedChild,
        futon: bedFuton,
        murphy: bedMurphy,
        crib:bedCrib,
        bedroomType:bedType
    };

    $.ajax({
        type: "POST",
        data: JSON.stringify(model),
        url: "/Home/UpdateBedroom",
        //data: data,
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
            GetListingBedrooms(listingId);
            ResetBedrooms();
            $("#grayout").css("display", "none");
            $("#editBedroom").css("display", "none");
            SaveNotification("Bedroom Information Updated!");
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function AddNewBedroom(user, id, title, desc, amenities, bedKing, bedQueen, bedDouble, bedTwin, bedBunk, bedChild, bedFuton, bedMurphy, bedCrib,bedType) {
    var listingId = $("#unitId").val();

    //TODO: add more to this!!
    //var data = "{userid:'" + user + "',listingId:'" + listingId + "', title:'" + title + "',desc:'" + desc + "', amenities:'" + amenities + "', king:'" + bedKing + "',queen:'" + bedQueen + "',doubleBed:'" + bedDouble + "', twin:'" + bedTwin + "',bunk:'" + bedBunk + "',child:'" + bedChild + "',futon:'" + bedFuton + "',murphy:'" + bedMurphy + "',crib:'" + bedCrib + "'}";

    var model = {
        userId: user,
        listingId: listingId,
        title: title,
        desc: desc,
        amenities: amenities,
        king: bedKing,
        queen: bedQueen,
        doubleBed: bedDouble,
        twin: bedTwin,
        bunk: bedBunk,
        child: bedChild,
        futon: bedFuton,
        murphy: bedMurphy,
        crib: bedCrib,
        bedType:bedType
    };

    $.ajax({
        type: "POST",
        data: JSON.stringify(model),
        url: "/Home/AddNewBedroom",
        //data: data,
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
            GetListingBedrooms(listingId);
            ResetBedrooms();
            $(".addBedroomDetail").slideUp("slow");
            $("#addBedroomDetail").slideDown("slow");
            SaveNotification("New Bedroom Added!");
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
    
}

function AddNewPOI(user, id, title) {
    var listingId = $("#unitId").val();


    //var data = "{userid:'" + user + "',listingId:'" + listingId + "', title:'" + title + "'}";
    var model = {
        userId: user,
        listingId: listingId,
        title: title
    };

    $.ajax({
        type: "POST",
        data: JSON.stringify(model),
        url: "/Home/AddNewPOI",
        //data: data,
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
            GetListingPOI(listingId);
            $(".addPOIDetail").slideUp("slow");
            $("#addPOIDetail").slideDown("slow");
            SaveNotification("New Point of Interest Added!");
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function AddNewWebsite(user, id, title, url) {
    var listingId = $("#unitId").val();


    //var data = "{userid:'" + user + "',listingId:'" + listingId + "', title:'" + title + "',url:'" + url + "'}";

    var model = {
        userId: user,
        listingId: listingId,
        title: title,
        url: url
    };

    $.ajax({
        type: "POST",
        data: JSON.stringify(model),
        url: "/Home/AddNewWebsite",
        //data: data,
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
            GetListingWebsites(listingId);
            $(".addWebsiteDetail").slideUp("slow");
            $("#addWebsiteDetail").slideDown("slow");
            SaveNotification("New Website Added!");
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function GetListingPOI(id) {
    var listingId = $("#unitId").val();
    var data = "{listingId:'" + listingId + "'}";
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingPOI",
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

            var myPoi = "";
            //myPoi = "<div class='row'>";
            for (var i = 0; i < tc.length; i++) {
                myPoi = myPoi + '<div class="row"><div  class="col-sm-3 poi" id="poi-' + tc[i].poiId + '">' +
                                    '<button type="button" class="close-btn poiRemove" id="delPOI-' + tc[i].poiId + '">X</button>' +
                    '<span><strong>' + tc[i].poiTitle + '</strong></span></div>';
            }

            $(document).on("click", ".poiRemove", function (event) {
                DeletePOI(this.id);
            });

            myPoi = myPoi + "</div>";

            $("#poiCount").val(tc.length);
            $("#poiListingSection").html(myPoi);

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function GetListingBathrooms(id) {
    //get my bedrooms
    var listingId = $("#unitId").val();
    var data = "{listingId:'" + listingId + "'}";
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingBathrooms",
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

            var myBathroomListing = "";
            myBathroomListing = "<div class='row'>";
            for (var i = 0; i < tc.length; i++) {
                myBathroomListing = myBathroomListing + '<div  class="col-sm-3" id="bath-' + tc[i].bathroomId + '">' +
                                    '<button type="button" class="close-btn bathRemove" id="delBath-' + tc[i].bathroomId + '">X</button>' +
                       '<span><a href="#" class="editBath" id="eBath_' + tc[i].bathroomId + '">(Edit)</a></span><br/>' +
                    '<span><strong>' + tc[i].bathroomTitle + '</strong></span><br/>' +
                    '<span class="bathSpan">' + tc[i].bathroomDescription + '</span><br/>' +
                    '<span class="bathSpan" id="amen-Bathroom-' + tc[i].bathroomId + '">' + GetAmenityDisplay('Bathroom', tc[i].bathroomAmenities, tc[i].bathroomId) + '</span><br/>' +
                    '<span class="bathSpan">' + tc[i].bathroomType + '</span></div>';
            }

            $(document).on("click", ".bathRemove", function (event) {
                DeleteBathroom(this.id);
            });

            myBathroomListing = myBathroomListing + "</div>";

            $("#bathCount").val(tc.length);
            $("#bathroomListingSection").html(myBathroomListing);

            $(".editBath").click(function() {
                $("#editBathroom").css("display", "inline");
                $("#grayout").css("display", "inline");
                GetBathroomDetails(this.id);
            });

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function GetBedroomDetails(bedroomId) {
    bedroomId = bedroomId.replace("e_bed_", "");
    ClearEditBedAndBath();
    //get my bedroom detail
    var listingId = $("#unitId").val();
    var data = "{listingId:'" + listingId + "',bedroomId:'" + bedroomId + "'}";
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetBedroomDetails",
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


            
            $("#e_bedroomTitle").val(tc[0].bedroomTitle);
            $("#e_bedroomType").val(tc[0].bedroomType);
            $("#e_bedroomDescription").val(tc[0].bedroomDescription);
            $("#e_bedKing").val(tc[0].kingBed);
            $("#e_bedQueen").val(tc[0].queenBed);
            $("#e_bedDouble").val(tc[0].doubleBed);
            $("#e_bedTwin").val(tc[0].twinBed);
            $("#e_bedBunk").val(tc[0].bunkBed);
            $("#e_bedChild").val(tc[0].childBed);
            $("#e_bedFuton").val(tc[0].futonBed);
            $("#e_bedMurphy").val(tc[0].murphyBed);
            $("#e_bedBaby").val(tc[0].cribBed);


            $("#editBedroomId").val(bedroomId);
            var amen = tc[0].bedroomAmenities;
            var amenSplit = amen.split(",");

            for (var i = 0; i < amenSplit.length; i++) {
                // Trim the excess whitespace.
                $("#bedAmen_" + amenSplit[i]).attr("checked", "checked");
            }


        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function ClearEditBedAndBath() {
    $("#e_bedKing").val("0");
    $("#e_bedQueen").val("0");
    $("#e_bedDouble").val("0");
    $("#e_bedTwin").val("0");
    $("#e_bedBunk").val("0");
    $("#e_bedChild").val("0");
    $("#e_bedFuton").val("0");
    $("#e_bedMurphy").val("0");
    $("#e_bedBaby").val("0");

    $("#e_bedroomType").val("0");
    $("#e_bedroomTitle").val("");
    $("#e_bedroomDescription").val("");
    //TODO:uncheck amenities

    $("#e_bathroomTitle").val("");
    $("#e_bathroomType").val("0");
    $("#e_bathroomDescription").val("");
    //TODO:uncheck amenities;
}

function GetBathroomDetails(bathroomId) {
    ClearEditBedAndBath();
    bathroomId = bathroomId.replace("eBath_", "");
    //get my bedroom detail
    var listingId = $("#unitId").val();
    var data = "{listingId:'" + listingId + "',bathroomId:'" + bathroomId + "'}";
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetBathroomDetails",
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



            $("#e_bathroomTitle").val(tc[0].bathroomTitle);
            $("#e_bathroomType").val(tc[0].bathroomType);
            $("#e_bathroomDescription").val(tc[0].bathroomDescription);

            $("#editBathroomId").val(bathroomId);

            var amen = tc[0].bathroomAmenities;
            var amenSplit = amen.split(",");

            for (var i = 0; i < amenSplit.length; i++) {
                // Trim the excess whitespace.
                $("#bathAmen_" + amenSplit[i]).attr("checked", "checked");
            }


        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function GetAmenityDisplay(type, amenityList, id) {

    
    //get my bedrooms
    var listingId = $("#unitId").val();
    var data = "{type:'" + type + "',amenityList:'" + amenityList + "'}";
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetAmenityDisplay",
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

            var myBedroomListing = "";
            //myBedroomListing = "<div class='row'>";
            for (var i = 0; i < tc.length; i++) {
                //myBedroomListing = myBedroomListing + '<div class="col-md-2 col-sm-4 col-xs-12" >' +
                 //   '<span><strong><i class="' + tc[i].amenityClass + '"></i> ' + tc[i].amenityTitle + '</strong></span></div>';

                myBedroomListing = myBedroomListing + '<span><strong><i class="' + tc[i].amenityClass + '"></i> ' +
                    tc[i].amenityTitle + '</strong></span><br/>';
            }

            $("#amen-"+type +"-"+id).html(myBedroomListing);
            
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function GetListingBedrooms(id) {
    //get my bedrooms
    var listingId = $("#unitId").val();
    var data = "{listingId:'" + listingId + "'}";
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingBedrooms",
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

            var myBedroomListing = "";
            myBedroomListing = "<h2>Bedrooms</h2><br/><div class='row '>";
            for (var i = 0; i < tc.length; i++) {
                myBedroomListing = myBedroomListing + '<div class="col-sm-3 col-xs-12 bedDiv" id="bed-' + tc[i].bedroomId + '">' +
                    '<button type="button" class="close-btn bedRemove" id="delBed-' + tc[i].bedroomId + '">X</button>' +
                    /* '<span><h3>BEDROOM #' + parseInt(parseInt(i) + 1) + '</h3></span>' +*/
                    '<span><a href="#" class="editBedroom" id="e_bed_' + tc[i].bedroomId + '">(Edit)</a></span><br/>' +
                    '<span><h3 style="margin-bottom:0px;">' + tc[i].bedroomTitle + '</h3></span><br/>' +
                    '<div>' + tc[i].bedroomType + '</div><br/>' +
                    '<div class="bedSpan" style="padding-bottom:15px;">' + tc[i].bedroomDescription + '</div>';

                myBedroomListing = myBedroomListing + "<span><strong>Beds: </strong></span>";
                if (tc[i].kingBed !== 0 && tc[i].kingBed !== "0") {
                    myBedroomListing = myBedroomListing + '<span class="bedSpan">(' + tc[i].kingBed + ') King&nbsp;&nbsp;</span>';
                }
                if (tc[i].queenBed !== 0 && tc[i].queenBed !== "0") {
                    myBedroomListing = myBedroomListing + '<span class="bedSpan">(' + tc[i].queenBed + ') Queen&nbsp;&nbsp;</span>';
                }
                if (tc[i].doubleBed !== 0 && tc[i].doubleBed !== "0") {
                    myBedroomListing = myBedroomListing + '<span class="bedSpan">(' + tc[i].doubleBed + ') Double&nbsp;&nbsp;</span>';
                }
                if (tc[i].twinBed !== 0 && tc[i].twinBed !== "0") {
                    myBedroomListing = myBedroomListing + '<span class="bedSpan">(' + tc[i].twinBed + ') Twin&nbsp;&nbsp;</span>';
                }
                if (tc[i].bunkBed !== 0 && tc[i].bunkBed !== "0") {
                    myBedroomListing = myBedroomListing + '<span class="bedSpan">(' + tc[i].bunkBed + ') Bunk&nbsp;&nbsp;</span>';
                }
                if (tc[i].childBed !== 0 && tc[i].childBed !== "0") {
                    myBedroomListing = myBedroomListing + '<span class="bedSpan">(' + tc[i].childBed + ') Child&nbsp;&nbsp;</span>';
                }
                if (tc[i].futonBed !== 0 && tc[i].futonBed !== "0") {
                    myBedroomListing = myBedroomListing + '<span class="bedSpan">(' + tc[i].futonBed + ') Futon&nbsp;&nbsp;</span>';
                }
                if (tc[i].murphyBed !== 0 && tc[i].murphyBed !== "0") {
                    myBedroomListing = myBedroomListing + '<span class="bedSpan">(' + tc[i].murphyBed + ') Murphy&nbsp;&nbsp;</span>';
                }
                if (tc[i].cribBed !== 0 && tc[i].cribBed !== "0") {
                    myBedroomListing = myBedroomListing + '<span class="bedSpan">(' + tc[i].cribBed + ') Crib&nbsp;&nbsp;</span>';
                }

                myBedroomListing = myBedroomListing + '<hr/>';

                myBedroomListing = myBedroomListing + '<span class="amenities" id="amen-Bedroom-' + tc[i].bedroomId + '">' + GetAmenityDisplay('Bedroom', tc[i].bedroomAmenities, tc[i].bedroomId) + '</span>';

                myBedroomListing = myBedroomListing + '</div>';
            }

            myBedroomListing = myBedroomListing + "</div>";

            $("#bedCount").val(tc.length);

            $("#bedroomListingSection").html(myBedroomListing);
            ValidateBedAndBath();

            $(".editBedroom").click(function () {
                $("#grayout").css("display", "inline");
                $("#editBedroom").css("display", "inline");
                GetBedroomDetails(this.id);
            });
           
            $(document).on("click", ".bedRemove", function (event) {
                DeleteBedroom(this.id);
            });
   
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function DeleteMe(type, id) {

    var thisId = id.split('-');

    if (type == "Pic") {
        thisId = id.split('|');
    }
    var myId = thisId[1];
    var listingId = $("#unitId").val();
    
    var data = "{type:'" + type + "',listingId:'" + listingId +"',deleteId:'" + myId +"'}";
    $.ajax({
        type: "POST",
        data: data,
        url: "/Home/RemoveItem",
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

            //SaveNotification(type + " Deleted!");
            switch(type) {
                case "Bed":
                    GetListingBedrooms();
                    break;
                case "Bath":
                    GetListingBathrooms();
                    break;
                case "Rate":
                    var listingId = $("#unitId").val();
                    GetListingRates(listingId, "USD");
                    break;
                case "Fee":
                    GetListingFees();
                    break;
                case "Pic":
                    GetListingPictures();
                    break;
                case "Web":
                    GetListingWebsites();
                    break;
                case "POI":
                    GetListingPOI();
                    break;
                default:
                    var listingId = $("#unitId").val();
                    GetListingDetail(listingId);
                    break;
            }
          
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });


}

function DeleteWebsite(thisId) {
    DeleteMe("Web", thisId);
}

function DeleteBedroom(thisId) {
    DeleteMe("Bed", thisId);
}

function DeleteBathroom(thisId) {
    DeleteMe("Bath", thisId);
}

function DeleteRate(thisId) {
    DeleteMe("Rate", thisId);
}

function DeleteFee(thisId) {
    DeleteMe("Fee", thisId);
}



function DeletePicture(thisId) {
    DeleteMe("Pic", thisId);
}

function DeletePOI(thisId) {
    DeleteMe("POI", thisId);
}

function GetPolicies() {
    var data = "{type:'Policies'}";
    $.ajax({
        type: "POST",
        data: data,
        url: "/Home/GetAmenityListByType",
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
            var amenityTypeDisplay = "";


            amenityStart = '<ul class="amenityPolicy">';
            amenityEnd = "</ul>";

            var theAmenities = amenityStart;

            for (var i = 0; i < tc.length; i++) {


                theAmenities = theAmenities +
                    '<div class="pretty p-default p-curve" style="width:250px;margin-top:5px;">' +
                    '<input type="checkbox" class="amenityCheck" id="' + tc[i].amenityId + '" >' +
                    '<div class="state" id="' + tc[i].amenityId + '-div">' +
                    '<i class="icon mdi mdi-check"></i>' +
                    '<label style="margin-left:10px;">' + tc[i].amenityTitle + '</label>' +
                    '</div>' +
                    '</div>';


            }
            theAmenities = theAmenities + amenityEnd;
            $("#policyCount").val(msg.length);
            $(".policyInfo").html(theAmenities);
            //TODO: ValidatePolicies();
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function GetBathroomAmenities() {

    var data = "{type:'Bathroom'}";
    $.ajax({
        type: "POST",
        data: data,
        url: "/Home/GetAmenityListByType",
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
            var amenityTypeDisplay = "";


            amenityStart = '<ul class="amenityBathroom">';
            amenityEnd = "</ul>";

            var theAmenities = amenityStart;

            for (var i = 0; i < tc.length; i++) {


                theAmenities = theAmenities +
                    '<div class="pretty p-default p-curve" style="width:250px;margin-top:5px;">' +
                    '<input type="checkbox" class="amenityCheckBathroom" id="bathAmen_' + tc[i].amenityId + '" >' +
                    '<div class="state" id="' + tc[i].amenityId + '-div">' +
                    '<i class="icon mdi mdi-check"></i>' +
                    '<label style="margin-left:10px;">' + tc[i].amenityTitle + '</label>' +
                    '</div>' +
                    '</div>';


            }
            theAmenities = theAmenities + amenityEnd;
            $("#bathroomAmenities").html(theAmenities);
            $("#e_bathroomAmenities").html(theAmenities);
            ValidateBedAndBath();
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function GetBedroomAmenities() {

    var data = "{type:'Bedroom'}";
    $.ajax({
        type: "POST",
        data: data,
        url: "/Home/GetAmenityListByType",
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
            var amenityTypeDisplay = "";
           

            amenityStart = '<ul class="amenityBedroom">';
            amenityEnd = "</ul>";

            var theAmenities = amenityStart;

            for (var i = 0; i < tc.length; i++) {

                
                theAmenities = theAmenities +
                    '<div class="pretty p-default p-curve" style="width:250px;margin-top:5px;">' +
                    '<input type="checkbox" class="amenityCheckBedroom" id="bedAmen_' + tc[i].amenityId + '" >' +
                    '<div class="state" id="' + tc[i].amenityId + '-div">' +
                    '<i class="icon mdi mdi-check"></i>' +
                    '<label style="margin-left:10px;">' + tc[i].amenityTitle + '</label>' +
                    '</div>' +
                    '</div>';


            }
            theAmenities = theAmenities + amenityEnd;

            $("#bedroomAmenities").html(theAmenities);
            $("#e_bedroomAmenities").html(theAmenities);

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
    
}

function GetOwnerInfo(id) {

    //get my related websites
    
    var data = "{listingId:'" + id + "'}";
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetOwnerInfo",
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

            $("#ownerFName").val(tc.firstName);
            $("#ownerLName").val(tc.lastName);
            $("#ownerPhone").val(tc.phone);
            $("#ownerEmail").val(tc.email);
            $("#ownerCity").val(tc.city);
            $("#ownerState").val(tc.state);
            $("#ownerCountry").val(tc.country);
            $("#ownerPostal").val(tc.zipcode);
            $("#ownerAddress").val(tc.address1);
            $("#ownerAddress2").val(tc.address2);
            $("#ownerCommission").val(tc.commissionPercentage);
            $("#ownerAgent").val(tc.headAgent);
            $("#reservationFName").val(tc.reservationFName);
            $("#reservationLName").val(tc.reservationLName);
            $("#reservationPhone").val(tc.reservationPhone);
            $("#reservationEmail").val(tc.reservationEmail);
            $("#conciergeFName").val(tc.conciergeFName);
            $("#conciergeLName").val(tc.conciergeLName);
            $("#conciergePhone").val(tc.conciergePhone);
            $("#conciergeEmail").val(tc.conciergeEmail);
            $("#ownerCompany").val(tc.ownerCompany);
            $("#reservationCompany").val(tc.reservationCompany);
            $("#conciergeCompany").val(tc.conciergeCompany);

            //GetPhonePrefix(tc.country);

            if (tc.reservationFName == "SAMEAS" && tc.reservationLName == "OWNER") {
                $("#resInfo").css("display", "none");
                $("#reservationSameAsOwner").prop('checked', true);
            }

            if (tc.conciergeFName == "SAMEAS" && tc.conciergeLName == "OWNER") {
                $("#concInfo").css("display", "none");
                $("#conciergeSameAsOwner").prop('checked', true);
            }
            ValidateOwner();

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
    

}

function GetListingWebsites(id) {
    //get my related websites
    var listingId = $("#unitId").val();
    var data = "{listingId:'" + listingId + "'}";
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingWebsites",
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

            var myWebsiteListing = "";
            myWebsiteListing = myWebsiteListing + '<div class="row">';

            for (var i = 0; i < msg.length; i++) {
                myWebsiteListing = myWebsiteListing + '<div class="col-sm-12" id="web-"' + tc[i].websiteId + '>' +
                    '<button type="button" class="close-btn webRemove" id="delWeb-' + tc[i].websiteId + '">X</button>' +
                    '<strong>' + tc[i].websiteTitle + '<strong><br/>' +
                    '<span class="webSpan"><a target="_blank" href="' + tc[i].websiteURL + '">' + tc[i].websiteURL + '</a></span></div>';
            }
            myWebsiteListing = myWebsiteListing + "</div>";

            $("#websiteListingSection").html(myWebsiteListing);

            $(document).on("click", ".webRemove", function (event) {
                DeleteWebsite(this.id);
            });
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function AddAmenityToListing(id) {
    var listingId = $("#unitId").val();


    var data = "{listingId:'" + listingId + "', amenityId:'" + id + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/AddAmenityToListing",
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
            var ac = $("#amenityCount").val();
            $("#amenityCount").val(parseInt(ac) + 1);
            ValidateAmenities();
            //SaveNotification("Listings Amenities Updated!");
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

    
}

function RemoveAmenityFromListing(id) {
    
    var listingId = $("#unitId").val();


    var data = "{listingId:'" + listingId + "', amenityId:'" + id + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/DeleteAmenityFromListing",
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
            var ac = $("#amenityCount").val();
            $("#amenityCount").val(parseInt(ac) - 1);
            ValidateAmenities();
            //SaveNotification("Listings Amenities Updated!");
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function GetCountries() {
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetCountries",
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

            var selectStart = '<select name="listingCountry" id="listingCountry" class="form-control" >';
            var selectStartOwn = '<select name="ownerCountry" id="ownerCountry" class="form-control" >';
            selectStart = selectStart + '<option value="">Country</option>';
            selectStartOwn = selectStartOwn + '<option value="">Country</option>';
            var selectEnd = '</select>';
            var sValue = "";
           
            for (var i = 0; i < tc.length; i++) {
                sValue = sValue + '<option value="' + tc[i].code + '">' + tc[i].title + '</option>';
            }

            $("#listingCountryDiv").html(selectStart + sValue + selectEnd);

            $("#ownerCountryDiv").html(selectStartOwn + sValue + selectEnd);

            $("#listingCountry").change(function (param) {
                var $this = $(this);
                ValidateControl($this);
                ValidateAllTheThings();
            });

            $("#ownerCountry").change(function (param) {
                var $this = $(this);
                ValidateControl($this);
                ValidateAllTheThings();
               // GetPhonePrefix($this.val());
            });

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function GetPhonePrefix(code) {



    var data = "{countryCode:'" + code + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetPhonePrefix",
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
            //get country code
            if (tc.phonePrefix !== "undefined" && tc.phonePrefix !== undefined) {
                $("#ownerPhonePrefix").html("+" + tc.phonePrefix);
            }
            

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
    
    
}

function formatPhoneUS(field) {
    var agt = navigator.userAgent.toLowerCase();
    var is_ie = (agt.indexOf("msie") != -1);

    if (!is_ie) {
        var temp = field.value.replace(/[^0-9]/g, "");
        var cursor = temp.length;

        temp = temp.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})(\d*)/, "($1)$2-$3 x $4");

        if (cursor < 11)
            temp = temp.replace(/\s*x\s*$/, "");
        if (cursor < 7)
            temp = temp.replace(/\-\s*$/, "");
        if (cursor < 3)
            temp = temp.replace(/\)\s*$/, "");
        if (!cursor)
            temp = "";
        if (temp.length > 13)
            temp = temp.substring(0, 13);

        field.value = temp;
        return true;
    } else {
        if (window.event.keyCode != 9 && window.event.keyCode != 16) {
            var temp = field.value.replace(/[^0-9]/g, "");
            var cursor = temp.length;

            temp = temp.replace(/^(\d{0,3})(\d{0,3})(\d{0,4})(\d*)/, "($1)$2-$3 x $4");

            if (cursor < 11)
                temp = temp.replace(/\s*x\s*$/, "");
            if (cursor < 7)
                temp = temp.replace(/\-\s*$/, "");
            if (cursor < 3)
                temp = temp.replace(/\)\s*$/, "");
            if (!cursor)
                temp = "";
            if (temp.length > 13)
                temp = temp.substring(0, 13);

            field.value = temp;
            return true;
        }
    }
}

function GetStateProv() {
    
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetStateProv",
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

            var selectStart = '<select name="listingState" id="listingState" class="form-control" >';
            var selectStartOwn = '<select name="ownerState" id="ownerState" class="form-control" >';
            selectStart = selectStart + '<option value="">State</option>';
            selectStartOwn = selectStartOwn + '<option value="">State</option>';
            var selectEnd = '</select>';
            var sValue = "";

            for (var i = 0; i < tc.length; i++) {
                sValue = sValue + '<option value="' + tc[i].code + '">' + tc[i].title + '</option>';
            }

            $("#listingStateDiv").html(selectStart + sValue + selectEnd);
            $("#ownerStateDiv").html(selectStartOwn + sValue + selectEnd);

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
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
            var amenityTypeDisplay = "";
            amenityHeader = "<hr/><h3 >__TYPE__</h3>";


            amenityStart = '<br/><br/><ul class="amenity">';
            amenityEnd = "</ul>";

            var theAmenities = amenityStart;

            for (var i = 0; i < tc.length; i++) {

                if (amenityType !== tc[i].amenityType) {
                    amenityType = tc[i].amenityType;

                    switch (amenityType) {
                        case "06-KitchenDining":
                            amenityTypeDisplay = "Kitchen & Dining";
                            break;
                        case "05-Entertainment":
                            amenityTypeDisplay = "Entertainment";
                            break;
                        case "08-Setting-View":
                            amenityTypeDisplay = "Settings & View";
                            break;
                        case "10-LocalAttractions":
                            amenityTypeDisplay = "Local Attractions";
                            break;
                        case "09-LeisureActivities":
                            amenityTypeDisplay = "Leisure Activities";
                            break;
                        case "12-SportsActivities":
                            amenityTypeDisplay = "Sports Activities";
                            break;
                        case "01-IncludedServices":
                            amenityTypeDisplay = "Included Services";
                            break;
                        case "07-OutdoorFeatures":
                            amenityTypeDisplay = "Outdoor Features";
                            break;
                        case "03-PopularAmenities":
                            amenityTypeDisplay = "Popular Amenities";
                            break;
                        case "04-PoolSpa":
                            amenityTypeDisplay = "Pool & Spa";
                            break;
                        case "11-LocalServices":
                            amenityTypeDisplay = "Local Services";
                            break;
                        case "02-AdditionalServices":
                            amenityTypeDisplay = "Additional Services";
                            break;
                        case "13-Suitability":
                            amenityTypeDisplay = "Suitability";
                            break;
                        case "14-Themes":
                            amenityTypeDisplay = "Themes";
                            break;
                        default:
                            amenityTypeDisplay = amenityType;
                            break;
                    }
                    theAmenities = theAmenities + '</ul><br/>' + amenityHeader.replace("__TYPE__", amenityTypeDisplay) + '<hr/>';
                }
                theAmenities = theAmenities + 
                    '<div class="pretty p-default p-curve" style="width:250px">' +
                    '<input type="checkbox" class="amenityCheck" id="' + tc[i].amenityId + '" >' +
                    '<div class="state" id="'+ tc[i].amenityId +'-div">' +
                    '<i class="icon mdi mdi-check"></i>'+
                    '<label style="margin-left:10px;">'+ tc[i].amenityTitle +'</label>' +
                    '</div>' +
                    '</div>';


            }

            $("#amenityListing").html(theAmenities);
            //if lastType != myTYpe, then close last ul (not first run through),  <h2> type, new ul/li
            //now that we have the list of amenities, check the ones that are mine
            PopulateMyAmenities();
           
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function PopulateMyAmenities() {

    var listingId = $("#unitId").val();


    var data = "{listingId:'" + listingId + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingAmenities",
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

            //uncheck all amenities

            $("#amenityCount").val(msg.length);

            for (var i = 0; i < msg.length; i++) {
               
                $('#' + tc[i].amenityId).prop('checked', true);
                $("#" + tc[i].amenityId + "-div").addClass("p-success");

            }

            ValidateAmenities();
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });


    
}

function GetListingDetail(myId) {

    //$("#listingDetail").css("display", "inline");
    //$("#grayout").fadeTo(50, 0.2);

    var listingDetails = "";



    var data = "{listingId:'" + myId + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingDetails",
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
        success: function(msg) {
            var tc = msg;

            var myListings = "";
            var myPictures = tc.myPictures;
            var displayPictures = "";

            $("#listingTitle").val(tc.title);

            //$("#sbHolder_" + $("#listingCategory").attr("sb")).val(tc.listingType);
            var listingTypeArray = tc.listingType;
            listingTypeArray = listingTypeArray.split(',');

            $("#listingCategory").val(listingTypeArray);
            for (a = 0; a < listingTypeArray.length; a++) {
                $("#listingDescription option[value='" + listingTypeArray[a] + "']").attr('selected', 'selected');
            }

            $("#listingDescription").val(tc.description);
            //$("#listingTags").val("");
            $("#geoSubDivision").val(tc.geoSubDivision);
            // $("#destinationType").val(tc.destinationCategory);
            $("#listingServiceFee").val(tc.serviceFee);
            $("#listingNumber").html(tc.listingNumber);

            var checkIn = tc.checkIn;
            var ciA = checkIn.split(":");
            var ciB = ciA[1].split(" ");
            $("#checkInHour").val(ciA[0]);
            $("#checkInMinute").val(ciB[0]);
            $("#checkInAMPM").val(ciB[1]);

            var checkOut = tc.checkOut;
            var coA = checkOut.split(":");
            var coB = coA[1].split(" ");
            $("#checkOutHour").val(coA[0]);
            $("#checkOutMinute").val(coB[0]);
            $("#checkOutAMPM").val(coB[1]);


            $("#listingStatus").val(tc.listingStatus);

           /* if (tc.listingStatus == "Incomplete" || tc.listingStatus == "Inactive") {

                $("#listingStatus option[value='Active']").attr("disabled", "disabled");
                $("#listingStatus option[value='Ghost']").attr("disabled", "disabled");
                $("#listingStatus option[value='Pending']").attr("disabled", "disabled");
            }
            */
            $("#listingSqFt").val(tc.listingSqFt);
            $("#listingBaths").val(tc.numBathrooms);
            $("#listingBeds").val(tc.numBedrooms);
            $("#listingPropertyName").val(tc.listingNickname);
            $("#unitId").val(tc.unitId);
            $("#listingId").val(tc.listingId);
            $("#listingAddress").val(tc.address1);
            $("#listingAddress2").val(tc.address2);
            $("#listingCity").val(tc.city);
            $("#listingState").val(tc.stateProv);
            $("#listingPostal").val(tc.zipPostal);
            $("#listingLatitude").val(tc.latitude);
            $("#listingLongitude").val(tc.longitude);
            $("#listingBaseCurrency").val(tc.baseCurrency);
            $("#listingTaxPercentage").val(tc.taxPercentage);
            $("#listingLocale").val(tc.locale);
            $("#listingMaxOccupancy").val(tc.maxOccupancy);
            $("#listingView").val(tc.listingView);

            //special workaround for country
            var desiredValue = tc.country;
            var el = document.getElementById("listingCountry");
            for (var i = 0; i < el.options.length; i++) {
                if (el.options[i].text == desiredValue) {
                    el.selectedIndex = i;
                    break;
                }
            }

            $("#listingTags").selectize({
                delimiter: ',',
                plugins: ['remove_button'],
                persist: true,
                create: function(input) {
                    return {
                        value: input,
                        text: input
                    }
                }
            });


            var listingTags = tc.listingTags;
            var ltArr;
            if (listingTags !== "") {
                ltArr = listingTags.split(",");
            }

            var $select = $(document.getElementById('listingTags'));
            var selectize = $select[0].selectize;
            if (typeof ltrArr!='undefined'){
                for (var i = 0; i < ltArr.length; i++) {
                    selectize.addItem(ltArr[i]);
                }
            }
        //selectize.refreshOptions();

            

            $("#lat").val(tc.latitude);
            $("#lng").val(tc.longitude);


            if (tc.geoSub1 !== "0") {
                $("#geoSubDivision1").val(tc.geoSub1);
                GetGeoSubDivsionByParent(tc.geoSub1, "1");
            }

            setTimeout(function () {
                if (tc.geoSub2 !== "0") {
                    $("#geoSubDivision2").val(tc.geoSub2);
                    GetGeoSubDivsionByParent(tc.geoSub2, "2");
                }
            }, 500);

            setTimeout(function () {
                if (tc.geoSub3 !== "0") {
                    $("#geoSubDivision3").val(tc.geoSub3);
                    GetGeoSubDivsionByParent(tc.geoSub3, "3");
                }
            }, 1000);

            initMap();

            if ( tc.featuredListing == "True" ) {
                $("#listingFeatured").prop("checked", "checked");
            }


            //need number of bedrooms, max occupancy


            //yListings = myListings + "<b>Num Bedrooms:</b> " + tc.numBedrooms + "<br/>";
            //myListings = myListings + "<b>Max Occupancy:</b> " + tc.maxOccupancy + "<br/>";

            //myListings = myListings + "<b>Source:</b> " + tc.source + "<br/>";
            //myListings = myListings + "<b>Unit Id:</b> " + tc.unitId + "<br/>";

            
            GetListingFees(myId);
            GetListingRates(myId, "USD");
            
            //var pictures = '<ul class="list-inline-block uploadImages">';


            if (myPictures != undefined) {
                DisplayPicturesOnScreen(myId,myPictures);                
            }
   
            /*
            $("#lat").val(tc.latitude);
            $("#lng").val(tc.longitude);

            initMap();
            */

            GetListingWebsites(myId);
            GetListingBedrooms(myId);
            GetListingBathrooms(myId);
            GetListingPOI(myId);
            GetOwnerInfo($("#listingId").val());

            $("html, body").animate({ scrollTop: "5px" });

     
            setTimeout(function () {
                ValidateAllTheThings();
            }, 800);


        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });



}

function BlockOutRateDates(startDate, endDate) {
    var sDate = new Date(startDate);
    var eDate = new Date(endDate);
    var dateArray = getDates(new Date(sDate), new Date(eDate));
    rateDateArray = rateDateArray.concat(dateArray);
}

function DisplayPicturesOnScreen(listingId,picArray) {

    var myPictures = picArray;
    var myId = listingId;
    var pictures = '<div class="row">';

    var activeOnce = true;

    $("#pictureCount").val(myPictures.length);

    pictures = pictures + "<ul id='sortablePics'>";

    var firstPicture = "firstPicture";

    for (var k = 0; k < myPictures.length; k++) {

        pictures = pictures + '<li class="form-group col-md-3 col-sm-6 col-xs-12 " id="pic_' + myPictures[k].originalName + '">' +
                '<div class="imageContainer">' +
                '<img src="/img/properties/' + myPictures[k].unitId + '/' + myPictures[k].originalName + '" height="320" width="320" alt="Image Listing" class="img-responsive">' +
                 '<button type="button" class="close-btn picRemove" id="delPic|' + myPictures[k].originalName + '">X</button>' +
                '<div class="centerNumber ' + firstPicture + '">' + parseInt(parseInt(k) + 1) + "</div></div>" +
                '<div class="pictureText"><input type="text" class="picText" id="picText-' + myPictures[k].originalName + '" class="form-control" value="' + myPictures[k].caption + '">' +
                '</li>';
        firstPicture = "";

    }

    pictures = pictures + '</ul></div>';


    $("#listingPictures").html(pictures);

    $(document).on("click", ".picRemove", function (event) {
        DeletePicture(this.id);
    });

    $(document).on("blur", ".picText", function (event) {
        UpdatePictureText(this.id, this.value);
    });
    


    $("#sortablePics").sortable({
        placeholder: "ui-state-highlight",
        stop: function (event, ui) {

            var serPics = $("#sortablePics").sortable("serialize", {
                attribute: "id"
            });

            var arrPics = $("#sortablePics").sortable("toArray");
            var myFileName = "";


            //TODO:display spinner & hide
            for (var p = 0; p < arrPics.length; p++) {
                    myFileName = arrPics[p];
                    UpdatePictureSequence(myId, myFileName.replace("pic_", ""), p + 1);
                    if (p == arrPics.length - 1) {
                        //wait a few seconds and then requery to pull correct order
                        setTimeout(function () {
                            GetListingPictures();
                        }, 100);
                }

            }

        }
    });


   
    
}

function UpdatePictureText(id, value) {

    id = id.replace("picText-", "");
    var listingId = $("#listingId").val();
    var data = "{listingId:'" + listingId + "', pictureId:'" + id + "',text:'" + value + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/EliteAdmin/UpdatePictureText",
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
            SaveNotification("Picture Text Updated!");
        },
        error: function (msg) {
            // //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}


function UpdatePictureSequence(listingId, pictureId, sequenceNumber) {
    console.log(listingId, pictureId, sequenceNumber);
    //var listingId = $("#unitId").val();
   // setTimeout(function () {
        var data = "{listingId:'" + listingId + "', pictureId:'" + pictureId + "',sequenceNumber:'" + sequenceNumber + "'}";

        $.ajax({
            type: "POST",
            //data: JSON.stringify(model),
            url: "/Home/UpdatePictureSequence",
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
                /*SaveNotification("Picture Sequence Updated!");*/
            },
            error: function (msg) {
                // //alert("something went wrong! " + msg.exception);
                //error yo
            }
        });
   // }, sequenceNumber*10);

   

}


function SetupSelects() {
    /*
    $('#listingTags').selectize({
        plugins: ['remove_button'],
        persist: false,
        valueField: 'code',
        labelField: 'description',
        searchField: ['code', 'description'],
        options: [
            { 'code': 'Private Island', 'description': 'Private Island' },
            { 'code': 'Remote', 'description': 'Remote' },
            { 'code': 'Secluded', 'description': 'Secluded' },
            { 'code': 'Exquisite', 'description': 'Exquisite' },
            { 'code': 'Need', 'description': 'Need' },
            { 'code': 'To', 'description': 'To' },
            { 'code': 'Add', 'description': 'Add' },
            { 'code': 'More', 'description': 'More' },
            { 'code': 'Tags', 'description': 'Tags' },
        ],
        //create: true,
        render: {
            item: function(item, escape) {


                //and show in top
                return '<div>' +
                    (item.code ? '<span class="codes">' + escape(item.code) + '</span>' : '') +
                    //(item.description ? '<span class="description">' + escape(item.description) + '</span>' : '') +
                    '</div>';

            },
            option: function(item, escape) {
                var label = item.code;
                var caption = item.code ? item.description : null;
               // return '<div>' +
                //    '<span class="labels">' + escape(label) + '</span>' + ' - ' +
                //    (caption ? '<span class="caption">' + escape(caption) + '</span>' : '') +
                //    '</div>';
                 //   
                return '<div>' +
                   (item.code ? '<span class="codes">' + escape(item.code) + '</span>' : '') +
                   //(item.description ? '<span class="description">' + escape(item.description) + '</span>' : '') +
                   '</div>';
            }
        },
        onDelete: function(values) {
            //return confirm(values.length > 1 ? 'Are you sure you want to remove these ' + values.length + ' items?' : 'Are you sure you want to remove "' + values[0] + '"?');
            ///add back in


            //remove from listing tags. . . 


            
            //will need a forloop for multi select!!
            //var myDesc = GetStatusCodeText(values[0]);
            //var $select = $(document.getElementById('statusInclude'));
            //var selectize = $select[0].selectize;
            //selectize.addOption({ description: myDesc, code: values[0] });
            //selectize.refreshOptions();

            //var $selectExcl = $(document.getElementById('statusExclude'));
            //var selectizeExcl = $selectExcl[0].selectize;
            //selectizeExcl.addOption({ description: myDesc, code: values[0] });
            //selectizeExcl.refreshOptions();
            
        }
});

*/
}