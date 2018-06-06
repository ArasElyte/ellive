function testScroll(ev) {
    //check screen width /position on resize or scroll
    var myWidth = window.innerWidth;
    var myYoffset = window.pageYOffset;
    var myPicWidth = 0;

    if (myWidth > 1200) {
        myPicWidth = (myWidth - 1170) / 2 - 35;
        if (myYoffset > 475) {
            $(".leftSideCarousel").css("display", "inline-block");
            $(".leftSideCarousel").css("width", myPicWidth);
            $(".rightSideCTA").css("display", "inline-block");
            $(".rightSideCTA").css("width", myPicWidth);
            $(".leftSideCarousel").html($("#listingCarousel").html());
            $(".fullScreen").css("display", "none");
            $(".carousel-indicators").css("display", "none");
            $(".carousel-control").css("display", "none");
            $("#mainContain").css("display", "inline-block");
        } else {
            $(".leftSideCarousel").css("display", "none");
            $(".rightSideCTA").css("display", "none");
            $(".fullScreen").css("display", "inline");
            $(".carousel-indicators").css("display", "inline");
            $(".carousel-control").css("display", "inline");
            $("#mainContain").css("display", "block");
        }
    }
}

window.onscroll = testScroll;

$(document).ready(function () {


    $(".bookNow").click(function() {
        $(".planTripTop").toggle();
    });

    //  DoMapStuff();

    var myId = url_query('lid');
    $("#unitId").val(myId);

    if (myId) {
        GetListingDetail(myId);
    }


    $(".xClose").click(function (e) {
        e.preventDefault();
        $("#grayout").css("display", "none");
        $("#listingDetail").css("display", "none");
    });

    $("#requestInfo").click(function() {
        SendLead();
    });

    $("#searchButton").click(function(){
        window.location = "search-results.html?q=" + $("#searchListings").val();
    });
});//end doc ready


function SendLead() {
    alert("send");
}

function DoMapStuff() {

    var mapStyles = [{
        'elementType': 'geometry',
        'stylers': [{
            'color': '#f5f5f5'
        }]
    },
    {
        'elementType': 'labels.icon',
        'stylers': [{
            'visibility': 'off'
        }]
    },
    {
        'elementType': 'labels.text.fill',
        'stylers': [{
            'color': '#616161'
        }]
    },
    {
        'elementType': 'labels.text.stroke',
        'stylers': [{
            'color': '#f5f5f5'
        }]
    },
    {
        'featureType': 'administrative.land_parcel',
        'elementType': 'labels.text.fill',
        'stylers': [{
            'color': '#bdbdbd'
        }]
    },
    {
        'featureType': 'poi',
        'elementType': 'geometry',
        'stylers': [{
            'color': '#eeeeee'
        }]
    },
    {
        'featureType': 'poi',
        'elementType': 'labels.text.fill',
        'stylers': [{
            'color': '#757575'
        }]
    },
    {
        'featureType': 'poi.park',
        'elementType': 'geometry',
        'stylers': [{
            'color': '#e5e5e5'
        }]
    },
    {
        'featureType': 'poi.park',
        'elementType': 'labels.text.fill',
        'stylers': [{
            'color': '#9e9e9e'
        }]
    },
    {
        'featureType': 'road',
        'elementType': 'geometry',
        'stylers': [{
            'color': '#ffffff'
        }]
    },
    {
        'featureType': 'road.arterial',
        'elementType': 'labels.text.fill',
        'stylers': [{
            'color': '#757575'
        }]
    },
    {
        'featureType': 'road.highway',
        'elementType': 'geometry',
        'stylers': [{
            'color': '#dadada'
        }]
    },
    {
        'featureType': 'road.highway',
        'elementType': 'labels.text.fill',
        'stylers': [{
            'color': '#616161'
        }]
    },
    {
        'featureType': 'road.local',
        'elementType': 'labels.text.fill',
        'stylers': [{
            'color': '#9e9e9e'
        }]
    },
    {
        'featureType': 'transit.line',
        'elementType': 'geometry',
        'stylers': [{
            'color': '#e5e5e5'
        }]
    },
    {
        'featureType': 'transit.station',
        'elementType': 'geometry',
        'stylers': [{
            'color': '#eeeeee'
        }]
    },
    {
        'featureType': 'water',
        'elementType': 'geometry',
        'stylers': [{
            'color': '#c9c9c9'
        }]
    },
    {
        'featureType': 'water',
        'elementType': 'labels.text.fill',
        'stylers': [{
            'color': '#9e9e9e'
        }]
    }
    ];



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

    var image = '../img/map/marker.png';
    var marker = new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon: image
    });

}

function GetListingDetail(myId) {

    $("#listingDetail").css("display", "inline");
    $("#grayout").fadeTo(50, 0.2);

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
            $("#greyform").fadeTo(50, 0.2);
            $("#loader").fadeTo(0, 1);
        },
        complete: function () {
            $("#greyform").hide();
            $("#loader").hide();
        },
        success: function (msg) {
            var tc = msg;

            var myListings = "";
            var myPictures = tc.myPictures;
            var displayPictures = "";

            $("#listing-title").html(tc.title);
            // $("#listing-address").html(tc.address1 + ' ' + tc.address2 + '<br/>' + tc.city + ', ' + tc.stateProv + ' ' + tc.zipPostal + ' (' + tc.country + ')');
            $("#listing-address").html(tc.city + ', ' + tc.stateProv + ' - ' + tc.country);
            $("#listing-summary").html("Sleeps " + tc.maxOccupancy + ": $" + Number(tc.rateMin).toLocaleString('en').replace(".00", "") + " - $" + Number(tc.rateMax).toLocaleString('en').replace(".00", "") + " / night ");
            $("#listingDescriptionStart").html(tc.description.substr(0, 200) + " . . .<a href='#description'>(Read More)</a>");
            $("#listingDescription").html(tc.description.replace(/\n/gi, "<br/>"));

            var bedBathBeyond = "<span class='bbb'><i class='fas fa-bed big'></i><br/>" + tc.numBedrooms +" Beds</span>" +
                "<span class='bbb'><i class='fas fa-bath big'></i><br/> " + tc.numBathrooms + " Baths</span>" +
                "<span class='bbb'><i class='fas fa-anchor big'></i><br/> Boat</span>" +
                "<span class='bbb'><i class='fas fa-binoculars big'></i><br/> Sightseeing</span>";
            $("#bedBathBeyond").html(bedBathBeyond);

            $("#lat").val(tc.latitude);
            $("#lng").val(tc.longitude);


            initMap();

            myListings = myListings + "<b>Listing Id:</b> " + tc.listingId + "<br/>";
            myListings = myListings + "<b>Listing Type:</b> " + tc.listingType + "<br/>";
            myListings = myListings + "<b>Locale:</b> " + tc.locale + "<br/>";
            myListings = myListings + "<b>Num Bedrooms:</b> " + tc.numBedrooms + "<br/>";
            myListings = myListings + "<b>Max Occupancy:</b> " + tc.maxOccupancy + "<br/>";
            myListings = myListings + "<b>Base Currency:</b> " + tc.baseCurrency + "<br/>";
            myListings = myListings + "<b>Tax Percentage:</b> " + tc.taxPercentage + "<br/>";
            myListings = myListings + "<b>Source:</b> " + tc.source + "<br/>";
            myListings = myListings + "<b>Unit Id:</b> " + tc.unitId + "<br/>";

          //  $("#otherInfo").html(myListings);

            //carousel for pictures
            var carouselTop = '<div id="myCarousel" class="carousel slide" data-ride="carousel">' +
                '<ol class="carousel-indicators">' +
                '<li data-target="#myCarousel" data-slide-to="0" class="active"></li>';

            var carosuelSlides = "";

            for (var k = 1; k < myPictures.length; k++) {
                carosuelSlides = carosuelSlides + '<li data-target="#myCarousel" data-slide-to="' + k + '"></li>';
            }

            displayPictures = displayPictures + carouselTop + carosuelSlides + '</ol>';

            displayPictures = displayPictures + '<div class="carousel-inner">';


            var activeOnce = true;

            for (var k = 0; k < myPictures.length; k++) {

                if (activeOnce) {
                    displayPictures = displayPictures + '<div class="item active">' +
                        '<div class="fullScreen"><i class="icon-fullscreen"></i></div>' +
                        '<img src="/img/properties/' + myPictures[k].unitId + '/' + myPictures[k].originalName + '" />' +
                       // '<img src="/img/properties/' + myPictures[k].unitId + '/' + myPictures[k].originalName + '" height="100%" width="100%"/>' +
                     
                        '</div>';
                    activeOnce = false;
                } else {
                    displayPictures = displayPictures + '<div class="item">' +
                        '<div class="fullScreen"><i class="icon-fullscreen"></i></div>' +
                        //'<img src="/img/properties/' + myPictures[k].unitId + '/' + myPictures[k].originalName + '" height="100%" width="100%"/>' +
                        '<img src="/img/properties/' + myPictures[k].unitId + '/' + myPictures[k].originalName + '" />' +
                        
                        '</div>';

                }

            }

            displayPictures = displayPictures + '<a class="left carousel-control" href="#myCarousel" data-slide="prev">' +
    '<span class="glyphicon glyphicon-chevron-left"></span>' +
    '<span class="sr-only">Previous</span>' +
  '</a>' +
  '<a class="right carousel-control" href="#myCarousel" data-slide="next">' +
    '<span class="glyphicon glyphicon-chevron-right"></span>' +
    '<span class="sr-only">Next</span>' +
  '</a>' +
'</div>';




            $("#listingCarousel").html(displayPictures + "<hr/>");


            $(".fullScreen").click(function() {
                
                var html = $(".fullScreen").html();

                if (html == '<i class="icon-fullscreen"></i>') {
                    $(".fullScreen").html("<i class='icon-shrink-1'></i>");
                    $("#carouselSummary").addClass("col-md-12").removeClass("col-md-6");
                    $("#detailSummary").addClass("col-md-12").removeClass("col-md-6");
                } else {
                    $(".fullScreen").html("<i class='icon-fullscreen'></i>");
                    $("#carouselSummary").addClass("col-md-6").removeClass("col-md-12");
                    $("#detailSummary").addClass("col-md-6").removeClass("col-md-12");
                }

            });

            var myRates = tc.myRates;

            var rateStartDate = "";
            var rateEndDate = "";

            if (myRates !== undefined) {
                var  displayRates= "<h2>Rates</h2>";

                displayRates = displayRates + "<select id='currencyType' class='form-control' style='width:250px;display:inline;'>" +
                    "<option value='0'>Select Currency</option>" +
                                                    "<option value='USD'>$ - U.S. Dollars </option>" +
                                                    "<option value='CHF'>&#8355; - Swiss Franc</option>" +
                                                    "<option value='EUR'>&euro; - Euro</option>" +
                                                    "<option value='GBP'>&#xa3; - British Pound</option>" +
                                                    "<option value='JPY'>&yen; - Yen</option>" +
                                                    "<option value='CAD'>$ - Canadian Dollar</option></select>" ;
                var alt = "";
                $("#rateCount").val(myRates.length);

                displayRates = displayRates + '<span id="currentCurrency" style="display:inline;padding-left:20px;">Prices are displayed in: ($) USD</span>';

                displayRates = displayRates + '<div class="row header ">' +
                   '<div class="col-md-7 col-sm-7 col-xs-12" style="font-weight:700">Date Range</div>' +
                    '<div class="col-md-3 col-sm-3 col-xs-12" style="font-weight:700">Nightly Rate</div>' +
                    '<div class="col-md-2 col-sm-2 col-xs-12" style="font-weight:700">Min Stay</div>' +
                    '</div>';


                for (var j = 0; j < myRates.length; j++) {

                    var xx = j % 2;
                    if (xx == 0) {
                        alt = "altRow";
                    } else {
                        alt = "";
                    }

                    rateStartDate = "";
                    rateEndDate = "";
                    if(myRates[j].startDate!=="") {
                        rateStartDate = DateRateMe(myRates[j].startDate);
                        rateEndDate = DateRateMe(myRates[j].endDate);
                        displayRates = displayRates + '<div style="color:black;" class="row ' + alt + '">' +
                            '<div class="col-md-7 col-sm-7 col-xs-12 rowStyle">' + rateStartDate + ' - ' + rateEndDate + '</div>' +
                            '<div class="col-md-3 col-sm-3 col-xs-12 rowStyle">' + "$" + Number(myRates[j].rateAmount).toLocaleString('en').replace(".00", "") + '</div>' +
                            '<div class="col-md-2 col-sm-2 col-xs-12 rowStyle">' + myRates[j].minStay + '</div>' +
                            '</div>';
                    }

                }
            }

            $("#rateListing").html(displayRates);

            $("#currencyType").change(function() {
                GetListingRatesByCurrCode($("#currencyType").val());//TODO:check this out !!!!!
            });



            var myFees = tc.myFees;


            if (myFees != undefined) {
                var displayFees = "<h2>Fees</h2>";
                var alt = "";
                var feeType = "";
                var feeTypeDisplay = "";
                $("#feeCount").val(myFees.length);

              

                for (var i = 0; i < myFees.length; i++) {


                    feeType = myFees[i].feeType;
                   
                    switch (feeType) {
                        case "SECURITY":
                            feeTypeDisplay = "Security Deposit";
                            break;
                        case "CLEANING":
                            feeTypeDisplay = "Cleaning Fee";
                            break;
                        case "HOUSEKEEPING":
                            feeTypeDisplay = "Housekeeping";
                            break;
                        case "CHEF":
                            feeTypeDisplay = "Private Chef";
                            break;
                        case "EVENT":
                            feeTypeDisplay = "Event Fee";
                            break;
                        default:
                            feeTypeDisplay = feeType;
                            break;
                    }

                   
                    displayFees = displayFees + "<div class='feeType'>" + feeTypeDisplay + "</div><div class='feeAmount'>" + "$" + Number(myFees[i].feeAmount).toLocaleString('en').replace(".00", "") + '</div><br/>';
                }

                if (tc.taxPercentage !== 0) {
                    displayFees = displayFees + "<div class='feeType'>Tax:</div><div class='feeAmount'>" + tc.taxPercentage + '%</div><br/>';
                }

                if (tc.taxPercentage !== 0) {
                    displayFees = displayFees + "<div class='feeType'>Service Fee:</div><div class='feeAmount'>" + tc.taxPercentage + '%</div><br/>';
                }

                $("#feeListing").html(displayFees);
            }

            $("html, body").animate({ scrollTop: "5px" });
            PopulateListingAmenities(myId);
            GetListingBedrooms(myId);
            GetListingBathrooms(myId);
            GetListingPolicies(myId);
            GetListingAccesibility(myId);

            //bedrooms
            //bathrooms
            //policies

        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });



}

function DateRateMe(thisDate) {
    var dtArray = thisDate.split("/");
    var mo = dtArray[0];
    var day = dtArray[1];
    var yr = dtArray[2];

    var dispMonth = "";

    switch(mo)
    {
        case "01":
        case "1":
            dispMonth = "Jan";
            break;
        case "02":
        case "2":
            dispMonth = "Feb";
            break;
        case "03":
        case "3":
            dispMonth = "Mar";
            break;
        case "04":
        case "4":
            dispMonth = "Apr";
            break;
        case "05":
        case "5":
            dispMonth = "May";
            break;
        case "06":
        case "6":
            dispMonth = "Jun";
            break;
        case "07":
        case "7":
            dispMonth = "Jul";
            break;
        case "08":
        case "8":
            dispMonth = "Aug";
            break;
        case "09":
        case "9":
            dispMonth = "Sep";
            break;
        case "10":
            dispMonth = "Oct";
            break;
        case "11":
            dispMonth = "Nov";
            break;
        case "12":
            dispMonth = "Dec";
            break;
        default:
            dispMonth = "";

    }

    return dispMonth + " " + day + ", " + yr;

}

function GetListingRatesByCurrCode(currType) {
    var listingId = $("#unitId").val();
    var data = "{listingId:'" + listingId + "',currType:'" + currType + "'}";
    $.ajax({
        type: "POST",
        data: data,
        url: "/Home/GetListingRates",
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

            var myRates = tc;

            var dollar = "$";

            switch (currType) {
                case "USD":
                    dollar = "$";
                    break;
                case "CAD":
                    dollar = "C$";
                    break;
                case "JPY":
                    dollar = "&yen;";
                    break;
                case "CHF":
                    dollar = "&#8355;";
                    break;
                case "EUR":
                    dollar = "&euro;";
                    break;
                case "GBP":
                    dollar = "&#xa3;";
                    break;
                default:
                    dollar = "$";
                    break;
            }

            if (myRates !== undefined) {
                var displayRates = "<h2>Rates</h2>";
                displayRates = displayRates + "<select id='currencyType' class='form-control' style='width:250px;display:inline;'>" +
                    "<option value='0'>Select Currency</option>" +
                                                    "<option value='USD'>$ - U.S. Dollars </option>" +
                                                    "<option value='CHF'>&#8355; - Swiss Franc</option>" +
                                                    "<option value='EUR'>&euro; - Euro</option>" +
                                                    "<option value='GBP'>&#xa3; - British Pound</option>" +
                                                    "<option value='JPY'>&yen; - Yen</option>" +
                                                    "<option value='CAD'>$ - Canadian Dollar</option></select>";
                var alt = "";
                $("#rateCount").val(myRates.length);

                displayRates = displayRates + '<span id="currentCurrency" style="display:inline;padding-left:20px;">Prices are displayed in: (' + dollar + ') ' + currType +'</span>';

               

                displayRates = displayRates + '<div class="row header ">' +
                  '<div class="col-md-7 col-sm-7 col-xs-12" style="font-weight:700">Date Range</div>' +
                   '<div class="col-md-3 col-sm-3 col-xs-12" style="font-weight:700">Nightly Rate</div>' +
                   '<div class="col-md-2 col-sm-2 col-xs-12" style="font-weight:700">Min Stay</div>' +
                   '</div>';

                var rateStartDate = "";
                var rateEndDate = "";


                for (var j = 0; j < myRates.length; j++) {

                    var xx = j % 2;
                    if (xx == 0) {
                        alt = "altRow";
                    } else {
                        alt = "";
                    }
                    rateStartDate = "";
                    rateEndDate = "";
                    if (myRates[j].startDate !== "") {
                        rateStartDate = DateRateMe(myRates[j].startDate);
                        rateEndDate = DateRateMe(myRates[j].endDate);
                        displayRates = displayRates + '<div style="color:black;" class="row ' + alt + '">' +
                            '<div class="col-md-7 col-sm-7 col-xs-12 rowStyle">' + rateStartDate + ' - ' + rateEndDate + '</div>' +
                            '<div class="col-md-3 col-sm-3 col-xs-12 rowStyle">' + dollar + Number(myRates[j].rateAmount).toLocaleString('en').replace(".00", "") + '</div>' +
                            '<div class="col-md-2 col-sm-2 col-xs-12 rowStyle">' + myRates[j].minStay + '</div>' +
                            '</div>';
                    }

                }

                $("#rateListing").html(displayRates);

                $("#currencyType").change(function () {
                    GetListingRatesByCurrCode($("#currencyType").val());//TODO:check this out !!!!!
                });
            }
            
        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function GetListingAccesibility(listingId) {
    var data = "{listingId:'" + listingId + "',type:'Suitability'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingAmenitiesDisplayByType",
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
            var amenityHeader = "";
            if (tc.length > 0) {
                amenityHeader = "<h2>Suitability</h2>";
            }
            var theAmenities = amenityHeader;

            for (var i = 0; i < tc.length; i++) {
                theAmenities = theAmenities + tc[i].amenityTitle + "<br/>";
            }

            $("#suitabilityListing").html(theAmenities);

        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function GetListingPolicies(listingId) {

    var data = "{listingId:'" + listingId + "',type:'Policies'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingAmenitiesDisplayByType",
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
            var amenityHeader = "";
            if (tc.length > 0) {
                amenityHeader = "<h2>Policies</h2>";
            }
            var theAmenities = amenityHeader;

            for (var i = 0; i < tc.length; i++) {
                theAmenities = theAmenities  + tc[i].amenityTitle + "<br/>";
            }

            $("#policyListing").html(theAmenities);

        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
    
}

function PopulateListingAmenities(listingId) {

    var data = "{listingId:'" + listingId + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingAmenitiesDisplay",
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
            var amenityStart = "";
            var amenityEnd = "";
            var amenityHeader = "";
            var amenityType = "";
            var amenityTypeDisplay = "";
            var amenityClass = "";
            amenityHeader = "<div class='col-sm-12'><h4 class='amenityHeader'>__TYPE__</h4>";

            var theAmenities = amenityStart;

            for (var i = 0; i < tc.length; i++) {

                if (amenityType !== tc[i].amenityType) {
                    amenityType = tc[i].amenityType;
                    theAmenities = theAmenities + "</div></div><div class='col-sm-12'>";
                    switch (amenityType) {
                    case "KitchenDining":
                        amenityTypeDisplay = "Kitchen & Dining";
                        break;
                    case "Setting-View":
                        amenityTypeDisplay = "Settings & View";
                        break;
                    case "LocalAttractions":
                        amenityTypeDisplay = "Local Attractions";
                        break;
                    case "LeisureActivities":
                        amenityTypeDisplay = "Leisure Activities";
                        break;
                    case "SportsActivities":
                        amenityTypeDisplay = "Sports Activities";
                        break;
                    case "OtherServices":
                        amenityTypeDisplay = "Other Services";
                        break;
                    case "OutdoorFeatures":
                        amenityTypeDisplay = "Outdoor Features";
                        break;
                    case "PopularAmenities":
                        amenityTypeDisplay = "Popular Amenities";
                        break;
                    case "PoolSpa":
                        amenityTypeDisplay = "Pool & Spa";
                        break;
                    case "LocalServices":
                        amenityTypeDisplay = "Local Services";
                        break;
                    default:
                        amenityTypeDisplay = amenityType;
                        break;
                    }
                    theAmenities = theAmenities + amenityHeader.replace("__TYPE__", amenityTypeDisplay);
                    if (tc[i].amenityClass == "") {
                        amenityClass = "icon-checked";
                    } else {
                        amenityClass = tc[i].amenityClass;
                    }
                    theAmenities = theAmenities + '<div class="col-md-3 col-sm-6 col-xs-12"><i class=" ' + amenityClass +'"></i> ' + tc[i].amenityTitle +"</div>";
                } else {
                    if (tc[i].amenityClass == "") {
                        amenityClass = "icon-checked";
                    } else {
                        amenityClass = tc[i].amenityClass;
                    }
                    theAmenities = theAmenities + '<div class="col-md-3 col-sm-6 col-xs-12"><i class=" ' + amenityClass + '"></i> ' + tc[i].amenityTitle + "</div>";
                }
                
                /*
                    '<div class="pretty p-default p-curve" style="width:200px">' +
                    '<input type="checkbox" class="amenityCheck" id="' + tc[i].amenityId + '" >' +
                    '<div class="state" id="' + tc[i].amenityId + '-div">' +
                    '<i class="icon mdi mdi-check"></i>' +
                    '<label style="margin-left:10px;">' + tc[i].amenityTitle + '</label>' +
                    '</div>' +
                    '</div>';
                    */


            }

            $("#amenityListing").html(theAmenities);
            
        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });



}


function GetListingBathrooms(listingId) {

    var data = "{listingId:'" + listingId + "'}";
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingBathrooms",
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

            var myBathroomListing = "";
            myBathroomListing = "<br/><h2>Bathrooms</h2><br/><div class='row'>";

           
            for (var i = 0; i < tc.length; i++) {
                
                
                myBathroomListing = myBathroomListing + '<div  class="col-sm-12 col-xs-12 bathDiv"  id="bath-' + tc[i].bathroomId + '">' +
                    '<h3>' + tc[i].bathroomTitle + ' (' + tc[i].bathroomType + ')</h3>' +
                    '<span class="bathSpan" >' + tc[i].bathroomDescription + '</span><hr/>' +
                    '<div class="amenities" style="width:200px; display:inline;" id="amen-Bathroom-' + tc[i].bathroomId + '">' + GetAmenityDisplay('Bathroom', tc[i].bathroomAmenities, tc[i].bathroomId) + '</div>' +
                    '</div>';
                
            }

            myBathroomListing = myBathroomListing + "</div>";

            $("#bathCount").val(tc.length);
            $("#bathroomListingSection").html(myBathroomListing);

        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
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
            $("#greyform").fadeTo(50, 0.2);
            $("#loader").fadeTo(0, 1);
        },
        complete: function () {
            $("#greyform").hide();
            $("#loader").hide();
        },
        success: function (msg) {
            var tc = msg;

            var amenList = "<div class='row' >";
            //myBedroomListing = "<div class='row'>";
            for (var i = 0; i < tc.length; i++) {
                
                amenList = amenList + '<div class="col-md-3 col-sm-6 col-xs-12"><strong><i class="' + tc[i].amenityClass + '"></i> ' +
                    tc[i].amenityTitle + '</strong></div>';
            }

            amenList = amenList + "</div>";
            $("#amen-" + type + "-" + id).html(amenList);

        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}


function GetListingBedrooms(listingId) {
    
    var data = "{listingId:'" + listingId + "'}";
    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingBedrooms",
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

            var myBedroomListing = "";
            myBedroomListing = "<h2>Bedrooms</h2><br/><div class='row '>";
            for (var i = 0; i < tc.length; i++) {
                myBedroomListing = myBedroomListing + '<div class="col-sm-12 col-xs-12 bedDiv" id="bed-' + tc[i].bedroomId + '">' +
                    /* '<span><h3>BEDROOM #' + parseInt(parseInt(i) + 1) + '</h3></span>' +*/
                    '<span><h3 style="margin-bottom:0px;">' + tc[i].bedroomTitle + '</h3></span><br/>' +
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

        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
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
            $("#greyform").fadeTo(50, 0.2);
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
            alert("something went wrong! " + msg.exception);
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
            $("#greyform").fadeTo(50, 0.2);
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
                    '<input type="checkbox" class="amenityCheckBathroom" id="' + tc[i].amenityId + '" >' +
                    '<div class="state" id="' + tc[i].amenityId + '-div">' +
                    '<i class="icon mdi mdi-check"></i>' +
                    '<label style="margin-left:10px;">' + tc[i].amenityTitle + '</label>' +
                    '</div>' +
                    '</div>';


            }
            theAmenities = theAmenities + amenityEnd;
            $("#bathroomAmenities").html(theAmenities);
            ValidateBedAndBath();
        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
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
            $("#greyform").fadeTo(50, 0.2);
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
                    '<div class="pretty p-default p-curve" style="width:200px;margin-top:5px;">' +
                    '<input type="checkbox" class="amenityCheckBedroom" id="' + tc[i].amenityId + '" >' +
                    '<div class="state" id="' + tc[i].amenityId + '-div">' +
                    '<i class="icon mdi mdi-check"></i>' +
                    '<label style="margin-left:10px;">' + tc[i].amenityTitle + '</label>' +
                    '</div>' +
                    '</div>';


            }
            theAmenities = theAmenities + amenityEnd;

            $("#bedroomAmenities").html(theAmenities);

        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}
