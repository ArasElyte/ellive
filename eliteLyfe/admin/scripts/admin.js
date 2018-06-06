

$(document).ready(function () {

    $('.about-form').bind("blur", function (value, settings) {
        $("#saveAbout").addClass("updated");
    });

    $('.location-form').bind("blur", function (value, settings) {
        $("#saveLocation").addClass("updated");
    });

    $('.owner-form').bind("blur", function (value, settings) {
        $("#saveOwner").addClass("updated");
    });

    $('#saveAbout').click(function (e) {
        if (ValidateAbout()) {
            SaveListingAbout();
        }
    });

    $('#saveLocation').click(function (e) {
        if (ValidateAddress()) {
            SaveListingLocation();
        }
    }); 

    $("#saveOwner").click(function (e) {
        if (ValidateOwner()) {
            SaveListingOwner();
        }
    });

    

});//end doc ready

function ErrorNotification(saveMessage) {
    
    $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: saveMessage
    }, {
        // settings
        element: 'body',
        position: null,
        type: "danger",
        allow_dismiss: true,
        placement: {
            from: "top",
            align: "center"
        },
        offset: 20,
        spacing: 10,
        z_index: 9999,
        delay: 100,
        timer: 100,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        },
        icon_type: 'class'
    });
    
};

function SaveNotification(saveMessage) {
    $.notify({
        icon: 'glyphicon glyphicon-star',
        message: saveMessage
    }, {
        // settings
        element: 'body',
        position: null,
        type: "success",
        allow_dismiss: true,
        placement: {
            from: "top",
            align: "center"
        },
        offset: 20,
        spacing: 10,
        z_index: 9999,
        delay: 100,
        timer: 100,
        animate: {
            enter: 'animated fadeInDown',
            exit: 'animated fadeOutUp'
        },
        icon_type: 'class'
    });
    
};

function SaveListingAbout() {


    var listingId = $("#listingId").val();
    var userId = $("#userId").val();
    var categoryArray = $("#listingCategory").val();
    if (categoryArray == null) {
        categoryArray = "";
    }
    var headline = $("#listingTitle").val();
    var propName = $("#listingPropertyName").val();
    var status = $("#listingStatus").val();
    var sqFt = $("#listingSqFt").val();
    var maxOccupancy = $("#listingMaxOccupancy").val();
    var beds = $("#listingBeds").val();
    var baths = $("#listingBaths").val();
    var checkIn = $("#checkInHour").val() + ":" + $("#checkInMinute").val() + " " + $("#checkInAMPM").val();
    if (checkIn == null) {
        checkIn = "";
    }
    var checkOut = $("#checkOutHour").val() + ":" + $("#checkOutMinute").val() + " " + $("#checkOutAMPM").val();
    if (checkOut == null) {
        checkOut = "";
    }
    var description = $("#listingDescription").val();
    var category = "";
    var featured = "false";
    var tags = $("#listingTags").val();
    if (tags == null) {
        tags = "";
    }

    if ($("#listingFeatured").is(':checked')) {
        featured = "true";
    }

    for (x = 0; x < categoryArray.length; x++) {
        category = category + categoryArray[x] + ",";
    }


    var model = {
        listingId: listingId,
        userId: userId,
        category: category,
        headline: headline,
        propertyName: propName,
        status: status,
        sqFt: sqFt,
        maxOccupancy: maxOccupancy,
        bed: beds,
        bath: baths,
        checkIn: checkIn,
        checkOut: checkOut,
        description: description,
        featured: featured,
        tags:tags
    };

    /*
    
     */
    //var description = "";
  
    //var data = "{listingId:'" + listingId+ "',userId:'" + userId +"',category:'" + category + "',headline:'" + headline +"',propertyName:'" + propName + "',status:'" + status + "',sqFt:'" + sqFt + "',maxOccupancy:'" + maxOccupancy + "',bed:'" + beds + "',bath:'" + baths + "',checkIn:'" + checkIn + "',checkOut:'" + checkOut + "',description:'" + description + "'}";

    $.ajax({
        type: "POST",
        data: JSON.stringify(model),
        url: "/EliteAdmin/SaveListingAbout",
       // data: data,
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
            $("#saveAbout").removeClass("updated");
            SaveNotification("Listings About Information Saved!");
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
    
}

function SaveListingLocation() {

    var listingId = $("#listingId").val();
    var userId = $("#userId").val();
    var geoSub1 = $("#geoSubDivision1").val();
    if (geoSub1 == null) {
        geoSub1 = "";
    }
    var geoSub2 = $("#geoSubDivision2").val();
    if (geoSub2 == null) {
        geoSub2 = "";
    }
    var geoSub3 = $("#geoSubDivision3").val();
    if (geoSub3 == null) {
        geoSub3 = "";
    }
    var address = $("#listingAddress").val();
    var address2 = $("#listingAddress2").val();
    var country = $("#listingCountry").val();
    if (country == null) {
        country = "";
    }
    var city = $("#listingCity").val();
    var state = $("#listingState").val();
    var zip = $("#listingPostal").val();
    var latitude = $("#listingLatitude").val();
    var longitude = $("#listingLongitude").val();
    var currency = $("#listingBaseCurrency").val();
    if (currency == null) {
        currency = "";
    }
    var tax = $("#listingTaxPercentage").val();
    var service = $("#listingServiceFee").val();
    
   
    //var data = "{listingId:'" + listingId + "',userId:'" + userId + "',geoSub1:'" + geoSub1 + "',geoSub2:'" + geoSub2 + "',geoSub3:'" + geoSub3 + "',address:'" + address + "',address2:'" + address2 + "',country:'" + country + "',city:'" + city + "',state:'" + state + "',zip:'" + zip + "',latitude:'" + latitude + "',longitude:'" + longitude + "',currency:'" + currency + "',tax:'" + tax + "',service:'" + service + "'}";
     
    var model = {
        listingId: listingId,
        userId: userId,
        geoSub1: geoSub1,
        geoSub2: geoSub2,
        geoSub3: geoSub3,
        address: address,
        address2: address2,
        country: country,
        city: city,
        state: state,
        zip: zip,
        latitude: latitude,
        longitude: longitude,
        currency: currency,
        tax: tax,
        service:service
    };

    $.ajax({
        type: "POST",
        data: JSON.stringify(model),
        url: "/EliteAdmin/SaveListingLocation",
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
            var myListings = "";
            $("#saveLocation").removeClass("updated");
            SaveNotification("Listings Location Information Saved!");
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function SaveListingOwner() {
    var listingId = $("#listingId").val();
    var userId = $("#userId").val();
    var ownerFName = $("#ownerFName").val();
    var ownerLName = $("#ownerLName").val();
    var ownerPhone = $("#ownerPhone").val();
    var ownerCompany = $("#ownerCompany").val();
    var ownerEmail = $("#ownerEmail").val();
    var ownerAddress = $("#ownerAddress").val();
    var ownerAddress2 = $("#ownerAddress2").val();
    var ownerCountry = $("#ownerCountry").val();
    var ownerCity = $("#ownerCity").val();
    var ownerState = $("#ownerState").val();
    var ownerZip = $("#ownerPostal").val();
    var ownerCommission = $("#ownerCommission").val();
    var ownerHeadAgent = $("#ownerAgent").val();
    var reservationFName = $("#reservationFName").val();
    var reservationLName = $("#reservationLName").val();
    var reservationPhone = $("#reservationPhone").val();
    var reservationEmail = $("#reservationEmail").val();
    var conciergeFName = $("#conciergeFName").val();
    var conciergeLName = $("#conciergeLName").val();
    var conciergePhone = $("#conciergePhone").val();
    var conciergeEmail = $("#conciergeEmail").val();
    var reservationCompany = $("#reservationCompany").val();
    var conciergeCompany = $("#conciergeCompany").val();
    var resSameAsOwner = false;
    var conSameAsOwner = false;

    if (ownerHeadAgent == null) {
        ownerHeadAgent = "";
    }
    if ($('#reservationSameAsOwner').is(':checked')) {
        resSameAsOwner = true;
        reservationFName = "SAMEAS";
        reservationLName = "OWNER";
    }

    if ($('#conciergeSameAsOwner').is(':checked')) {
        conSameAsOwner = true;
        conciergeFName = "SAMEAS";
        conciergeLName = "OWNER";
    }


    //var data = "{listingId:'" + listingId + "',userId:'" + userId + "',ownerFName:'" + ownerFName + "',ownerLName:'" + ownerLName + "',ownerPhone:'" + ownerPhone + "',ownerEmail:'" + ownerEmail + "',ownerAddress:'" + ownerAddress + "',ownerAddress2:'" + ownerAddress2 + "',ownerCountry:'" + ownerCountry + "',ownerCity:'" + ownerCity + "',ownerState:'" + ownerState + "',ownerZip:'" + ownerZip + "',ownerCommission:'" + ownerCommission + "',ownerAgent:'" + ownerHeadAgent + "',reservationFName:'" + reservationFName + "',reservationLName:'" + reservationLName + "',reservationPhone:'" + reservationPhone + "',reservationEmail:'" + reservationEmail + "',conciergeFName:'" + conciergeFName + "',conciergeLName:'" + conciergeLName + "',conciergePhone:'" + conciergePhone + "',conciergeEmail:'" + conciergeEmail + "',ownerCompany:'" + ownerCompany + "',reservationCompany:'" + reservationCompany + "',conciergeCompany:'" + conciergeCompany + "'}";
        
    var model = {
        listingId: listingId,
        userId: userId,
        ownerFName: ownerFName,
        ownerLName: ownerLName,
        ownerPhone: ownerPhone,
        ownerEmail: ownerEmail,
        ownerAddress: ownerAddress,
        ownerAddress2: ownerAddress2,
        ownerCountry: ownerCountry,
        ownerCity: ownerCity,
        ownerState: ownerState,
        ownerZip: ownerZip,
        ownerCommission: ownerCommission,
        ownerAgent: ownerHeadAgent,
        reservationFName: reservationFName,
        reservationLName: reservationLName,
        reservationPhone: reservationPhone,
        reservationEmail: reservationEmail,
        conciergeFName: conciergeFName,
        conciergeLName: conciergeLName,
        conciergePhone: conciergePhone,
        conciergeEmail: conciergeEmail,
        ownerCompany: ownerCompany,
        reservationCompany: reservationCompany,
        conciergeCompany: conciergeCompany
    };

    $.ajax({
        type: "POST",
        data: JSON.stringify(model),
        url: "/EliteAdmin/SaveListingOwner",
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
            var myListings = "";
            $("#saveOwner").removeClass("updated");
            SaveNotification("Listings Owner Information Saved!");

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
    
}