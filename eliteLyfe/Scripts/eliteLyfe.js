$(document).ready(function () {

    $("#advancedSearch").click(function() {

        $("#advancedSearchItems").slideToggle("slow");
    });

        $("#priceSliderContainer").slider({
            min: 0,
            max: 10000,
            step: 1000,
            value:5000
    }
    );

    DoMapStuff();

    $('#searchButton').click(function (e) {
        
        
        /*var criteria = $('#searchBox').val();
        var send = "GetListingResults?searchCriteria=" + criteria;
        var response = JSON.parse(TestAPI(send));
        alert("Referrer Credit: " + response.listingType + " Referree Credit: " + response.address1);
        */

        SearchTheListings();

        

    });

    $("#callToActionTop").click(function () {
        alert("you clicked the button!");
    });


    $(".xClose").click(function (e) {
        e.preventDefault();
        $("#grayout").css("display", "none");
        $("#listingDetail").css("display", "none");
    });
});//end doc ready

/*
function TestAPI(send) {
    var request = new XMLHttpRequest();
    request.open("get", "/api/values/" + send, false);
    request.send();

    return request.response;

}
*/

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

   // $("#listingDetail").css("display", "inline");
   // $("#grayout").fadeTo(50, 0.2);

    var listingDetails = "";

    window.location = "listing-details.html?lid=" + myId;
    return;
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
        success: function (msg) {
            var tc = msg;

            var myListings = "";
            var myPictures = tc.myPictures;
            var displayPictures = "";

            myListings = myListings + "<h2> " + tc.title + "</h2>";

            myListings = myListings + "<a href='../edit-listings.html?lid=" + tc.unitId + "'>Edit</a>";

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
                        '<img src="/img/properties/' + myPictures[k].unitId + '/' + myPictures[k].originalName + '" height="900" width="1200"/>' +
                        '</div>';
                    activeOnce = false;
                } else {
                    displayPictures = displayPictures + '<div class="item">' +
                        '<img src="/img/properties/' + myPictures[k].unitId + '/' + myPictures[k].originalName + '" height="900" width="1200"/>' +
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




            // alert("yay!");
            displayPictures = displayPictures + "<hr/>";
            myListings = myListings + displayPictures;

            myListings = myListings + '<h3>' + tc.address1 + ' ' + tc.address2 + ' - ' + tc.city + ', ' + tc.stateProv + ' ' + tc.zipPostal +' (' + tc.country + ') </h3>' ;
           
            myListings = myListings + "<br/>" + tc.description + "<br/><br/><br/>";
            myListings = myListings + "<b>Latitude:</b> " + tc.latitude + "<br/>";
            myListings = myListings + "<b>Longitude:</b> " + tc.longitude + "<br/>";
            myListings = myListings + "<b>Listing Id:</b> " + tc.listingId + "<br/>";
            myListings = myListings + "<b>Listing Type:</b> " + tc.listingType + "<br/>";
            myListings = myListings + "<b>Locale:</b> " + tc.locale + "<br/>";
            myListings = myListings + "<b>Num Bedrooms:</b> " + tc.numBedrooms + "<br/>";
            myListings = myListings + "<b>Max Occupancy:</b> " + tc.maxOccupancy + "<br/>";
            myListings = myListings + "<b>Base Currency:</b> " + tc.baseCurrency + "<br/>";
            myListings = myListings + "<b>Tax Percentage:</b> " + tc.taxPercentage + "<br/>";
            myListings = myListings + "<b>Source:</b> " + tc.source + "<br/>";
            myListings = myListings + "<b>Unit Id:</b> " + tc.unitId + "<br/>";


            $("#lat").val(tc.latitude);
            $("#lng").val(tc.longitude);

            initMap();
            var myFees = tc.myFees;
            
            var myRates = tc.myRates;

            var displayFees = "<h2>Fees</h2>";
           
            var displayRates = "<h2>Rates</h2>";

            for (var i = 0; i < myFees.length; i++) {
                displayFees = displayFees + '<b>Fee Type</b>: ' + myFees[i].feeType + '<br/><b>Fee Amount: ' + myFees[i].feeAmount + '<br/>';
                
            }
            displayFees = displayFees + "<hr/>";

            myListings = myListings + displayFees;

            for (var j = 0; j < myRates.length; j++) {
                displayRates = displayRates + '<b>Type:</b>: ' + myRates[j].rateType + '<br/>';
                displayRates = displayRates + '<b>Dates: ' + myRates[j].startDate + '-' + myRates[j].endDate + '<br/>';
                displayRates = displayRates + '<b>Min/Max Stay: ' + myRates[j].minStay + '-' + myRates[j].maxStay + '<br/>';
                displayRates = displayRates + '<b>Week Night:</b>' + myRates[j].perWeekNight + '</br>';
                displayRates = displayRates + '<b>Weekend Night:</b>' + myRates[j].perWeekendNight + '</br>';
                displayRates = displayRates + '<b>Week:</b>' + myRates[j].perWeek + '</br>';
                displayRates = displayRates + '<b>Month:</b>' + myRates[j].perMonth + '</br>';
            }
            displayRates = displayRates + "<hr/>";
            myListings = myListings + displayRates;



            $("#theDetails").html(myListings);

            $("html, body").animate({ scrollTop: "5px" });

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

    

}


