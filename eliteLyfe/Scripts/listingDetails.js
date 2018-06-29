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


//window.onscroll = testScroll;

jQuery(document).on('keyup', function (evt) {
    if (evt.keyCode == 27) {
        window.location = window.location.href;
    }
});


$(document).scroll(function () {
    var y = $(document).scrollTop(), //get page y value 
        header = $("#ecSideFollow");
    if (y >= 600) {
       // if ($(document).width > 600) {
            if ($(document).width() > 1600) {
                header.css({ position: "fixed", "bottom": "0", "right": "200px" });
            } else {
                header.css({ position: "fixed", "bottom": "0", "right": "0" });
            }
       // }
        
        
    } else {
        
        header.css({ position: "relative", "bottom": "0", "right": "0" });
    }
});


function DetailClick(anchor) {
    $("#ecOverview").removeClass("ecActive");
    $("#ecDetails").addClass("ecActive");
    $("#listingDescriptionStart").fadeOut();
    $("#listingDescription").fadeIn();
    $(".amenityTop").fadeOut();
    $(".amenityFull").fadeIn();
    $("#bedroomListingSection").fadeIn();
    $("#bathroomListingSection").fadeIn();
    $(".ecViewDetails").fadeOut();

    switch (anchor) {
        case "home":
            //do nothing
            break;
        case "details":
            //do nothing - scroll is not working right
            /*$('html, body').animate({
                scrollTop: $('[id="linkDescription"]').offset().top-150
            }, 200);*/
            break;
        case "amenities":
            $('html, body').animate({
                scrollTop: $('[id="linkAmenities"]').offset().top-300
            }, 200);
            break;

    }

    
}

$(document).ready(function () {

    //settimeout
    setTimeout(function() {
        if ($(".rsFullscreenIcn").css("display") == "block" && $("#featuredImage").css("display") !== "block") {
            $("#featuredImage").css("display", "block");
            $("#rsCarousel").css("display", "none");
        }
    }, 500);

    $("#ecShare").click(function() {
        $("#shareform").css("display","inline");
        $("#greyform").css("display", "inline");

    });

    $(".closeShare").click(function() {
        $("#shareform").fadeOut();
        $("#greyform").fadeOut();
    });


    $("#shareLink").val(window.location.href);

    $("#shareLink").click(function () {
        var copyText = document.getElementById("shareLink");
        copyText.select();
        document.execCommand("Copy");
        $("#copyLink").html("Link Copied!");
    });

    $("#copyLink").click(function () {
        var copyText = document.getElementById("shareLink");
        copyText.select();
        document.execCommand("Copy");
        $("#copyLink").html("Link Copied!");
    });
    

    $(".ecViewDesc").click(function() {
        DetailClick("details");
    });

    $(".ecViewAmen").click(function () {
        DetailClick("amenities");
    });


    $("#ecDetails").click(function () {
        DetailClick("home");
    });

    $("#ecOverview").click(function () {
        $("#ecOverview").addClass("ecActive");
        $("#ecDetails").removeClass("ecActive");
        $("#listingDescriptionStart").fadeIn();
        $("#listingDescription").fadeOut();
        $(".amenityTop").fadeIn();
        $(".amenityFull").fadeOut();
        $("#bedroomListingSection").fadeOut();
        $("#bathroomListingSection").fadeOut();
        $(".ecViewDetails").fadeIn();
    });



 

    $(".bookNow").click(function () {
        GoToContactForm();
    });

    $("#closeForm").click(function () {
        $(".planTripTop").toggle();
        $(".bookNow").slideDown();
    });

      

    var myId = url_query('lid');
    $("#unitId").val(myId);

    if (myId) {
        GetListingDetail(myId);
    }


   /* $(".xClose").click(function (e) {
        e.preventDefault();
        $("#grayout").css("display", "none");
        $("#listingDetail").css("display", "none");
    });*/

    $(".xClosex").click(function (e) {
        e.preventDefault();
        $("#grayout").css("display", "none");
        $("#picForm").css("display", "none");
    });
    
    $("#requestInfo").click(function() {
        SendLead();
    });

    $("#searchButton").click(function(){
        window.location = "search-results.html?q=" + $("#searchListings").val();
    });

    $("#arriveDate").datepicker();
    $("#departDate").datepicker();
    $(".page-loader").fadeOut();
});//end doc ready


function SendLead() {
    var fname = $("#infoFName").val();
    var lname = $("#infoLName").val();
    var email = $("#infoEmail").val();
    var phone = $("#infoPhone").val();
    var comments = $("#infoComments").val();
    var dates = $("#infoDates").val();
    var msgErr = "";

    if (fname == "") {
        msgErr = msgErr + "First Name Required<br/>";
        $("#infoFName").addClass("errorBox");
    } else {
        $("#infoFName").removeClass("errorBox");
    }
    if (lname == "") {
        msgErr = msgErr + "Last Name Required<br/>";
        $("#infoLName").addClass("errorBox");
    } else {
        $("#infoLName").removeClass("errorBox");
    }
    if (email == "") {
        msgErr = msgErr + "Email Required<br/>";
        $("#infoEmail").addClass("errorBox");
    } else {
        $("#infoEmail").removeClass("errorBox");
    }

    var listingId = $("#unitId").val();
    var listingName = $("#listing-title").html();

    if (msgErr !== "") {
        $("#infoError").css("display", "inline");
        $("#infoError").html(msgErr);
    } else {
        $("#infoError").css("display", "none");
        ActuallySendLead(fname, lname, email, phone, comments, dates, listingId, listingName);
        alert("Thanks!");
        //TODO: Clear Form Data
        ClearFormDataAndClose();
    }

}

function ClearFormDataAndClose() {
    $("#infoFName").val("");
    $("#infoLName").val("");
    $("#infoEmail").val("");
    $("#infoPhone").val("");
    $("#infoComments").val("");
    $("#infoDates").val("");

    $(".planTripTop").css("display","none");
}

function ActuallySendLead(fname, lname, email, phone, comments, dates,listingId, listingName) {
    //SubmitInquiry(string fname, string lname, string email, string phone, string travelDates, string comments, int listingId)
    var data = "{fname:'" + fname + "',lname:'" + lname + "',email:'" + email + "',phone:'" + phone + "',travelDates:'" + dates + "',comments:'" + comments + "',listingId:'" + listingId + "',listingName:'" + listingName + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/SubmitInquiry",
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
    var uluru = { lat: myLat, lng: myLng };
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: uluru,disableDefaultUI: true
    });
    /*var marker = new google.maps.Marker({
        position: uluru,
        map: map
    });
*/
    
    var image = '../assets/all/back_crown.png';
    var marker = new google.maps.Marker({
        position: uluru,
        map: map,
        icon: image
    });
    
}

function initMapOld() {

    DoMapStuff();

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
    google.maps.event.addDomListener(window, 'load', initialize);
    
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

            var featuredDisplay = "";
            if (tc.featuredListing == "True") {
                featuredDisplay = "<div class='featuredProp'>EliteLyfe Featured Property!</div>";
            }

            $("#listing-title").html(featuredDisplay + tc.title);

            $("#bookTitle").html(tc.title);
            // $("#listing-address").html(tc.address1 + ' ' + tc.address2 + '<br/>' + tc.city + ', ' + tc.stateProv + ' ' + tc.zipPostal + ' (' + tc.country + ')');
            $("#listing-address").html(tc.city.toUpperCase() + ', ' + tc.stateProv.toUpperCase() + ' - ' + tc.country.toUpperCase());
            $(".listing-summary").html("$" + Number(tc.rateMin).toLocaleString('en').replace(".00", "") + " - $" + Number(tc.rateMax).toLocaleString('en').replace(".00", "") + " / Per Night");
            $("#listing-number").html(tc.listingNumber);
            $("#listingDescriptionStart").html(tc.description.substr(0, 400) + " . . .");
            $("#listingDescription").html('<p>' + tc.description.replace(/\n/gi, "</p><p>") + '</p>');

            var bedBathBeyond = "<div class='bbb'><img src='../assets/svg/person.svg' class='ecImgIcon ecPerson' />" + tc.maxOccupancy + " GUESTS <img src='../assets/svg/bed.svg'  class='ecImgIcon'/>" + tc.numBedrooms + " BEDROOM " + "<img src='../assets/svg//bath.svg'  class='ecImgIcon'/>" + tc.numBathrooms + " BATH</div>";
               
            $("#bedBathBeyond").html(bedBathBeyond);

            $("#lat").val(tc.latitude);
            $("#lng").val(tc.longitude);

            setTimeout(function () { initMap(); }, 1000);
            

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
                '<li class="liWide" data-target="#myCarousel" data-slide-to="0" class="active"></li>';

            var carosuelSlides = "";

            for (var k = 1; k < myPictures.length; k++) {
                carosuelSlides = carosuelSlides + '<li class="liWide" data-target="#myCarousel" data-slide-to="' + k + '">' + '</li>';
            }

            displayPictures = displayPictures + carouselTop + carosuelSlides + '</ol>';

            displayPictures = displayPictures + '<div class="carousel-inner">';


            var activeOnce = true;

            for (var k = 0; k < myPictures.length; k++) {

                if (activeOnce) {
                    displayPictures = displayPictures + '<div class="item active">' +
                      //  '<div class="fullScreen"><i class="icon-fullscreen"></i></div>' +
                        '<img src="/img/properties/' + myPictures[k].unitId + '/' + myPictures[k].originalName + '" />' +
                       // '<img src="/img/properties/' + myPictures[k].unitId + '/' + myPictures[k].originalName + '" height="100%" width="100%"/>' +
                     
                        '</div>';
                    activeOnce = false;
                } else {
                    displayPictures = displayPictures + '<div class="item">' +
                      //  '<div class="fullScreen"><i class="icon-fullscreen"></i></div>' +
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




           //$("#listingCarousel").html(displayPictures + "<hr/>");



            ///OLD NEW CAROUSEL

            /*
            var royalSlider = '<div class="royalSlider rsDefault" id="rsCarousel">';
            for (var r = 0; r < myPictures.length; r++) {
                if (r == 0) {
                    //add first image to background
                    $("#villaMainImage").attr("src", "/img/properties/" + myPictures[r].unitId + "/" + myPictures[r].originalName);
                }
                royalSlider = royalSlider + '<img class="rsImg" data-rsBigImg="/img/properties/' + myPictures[r].unitId + '/' + myPictures[r].originalName + '" src="/img/properties/' + myPictures[r].unitId + '/' + myPictures[r].originalName + '"/>';
            }

            royalSlider = royalSlider + '</div>';



            $("#listingCarousel").html(royalSlider);

            $("#rsCarousel").royalSlider({
                // options go here
                // as an example, enable keyboard arrows nav
                keyboardNavEnabled: true,
                autoScaleSlider: true,
              
                imageScaleMode:'none',
          
                fullscreen: {
                    // fullscreen options go gere
                    enabled: true,
                    nativeFS: false
                }
            });

          $(".rsArrowIcnFeat").click(function () {
                $("#featuredImage").css("display", "none");
                $("#carouselSummary").css("display", "inline");
                $("#listingCarousel").fadeIn("slow");
                $(".rsImg ").css("margin-left", "0px;");
                featuredImage
                $(".rsFullscreenIcn").click();
            });
            */


            var royalSlider = "";

            royalSlider = '<div class="royalSlider rsDefault" id="rsCarousel">';
            for (var r = 0; r < myPictures.length; r++) {
                if (r == 0) {
                    //add first image to background
                    $("#featuredImage").css("background", "url('/img/properties/" + myPictures[r].unitId + "/" + myPictures[r].originalName +"')");
                    $("#featuredImage").css("background-size", "cover");
                    $("#featuredImage").css("background-position", "center");
                }
                royalSlider = royalSlider + '<a class="rsImg" data-rsbigimg="/img/properties/' + myPictures[r].unitId + '/' + myPictures[r].originalName + '" href="/img/properties/' + myPictures[r].unitId + '/' + myPictures[r].originalName + '">' + "TITLE HERE" + '<img width="96" height="72" class="rsTmb" src="/img/properties/' + myPictures[r].unitId + '/' + myPictures[r].originalName + '"/></a>'
            }

            royalSlider = royalSlider + '</div>';

            $("#listingCarousel").html(royalSlider);



            //setTimeout(function(){ 

            $('#rsCarousel').royalSlider({
                fullscreen: {
                    enabled: true,
                    nativeFS: true,
                    buttonFS:true
                },
                controlNavigation: 'thumbnails',
                /*autoScaleSlider: true,
                autoScaleSliderWidth: 800,
                autoScaleSliderHeight: 600,*/
                loop: true,
                imageScaleMode: 'fit-if-smaller',
                navigateByClick: true,
                numImagesToPreload: 4,
                arrowsNav: true,
                arrowsNavAutoHide: true,
                arrowsNavHideOnTouch: true,
                keyboardNavEnabled: true,
                fadeinLoadedSlide: true,
                globalCaption: false,
                globalCaptionInside: false,
                
                thumbs: {
                    appendSpan: true,
                    firstMargin: true,
                    paddingBottom: 4
                }
            });



           // $("#listingCarousel").css("display", "none");
            $("#closeCarousel").css("display", "none");

         /*   $(".rsArrowIcnFeat").click(function () {
                $("#villaMainImage").click();
            });

            */
           /* $(".rsFullscreenIcn").click(function (e) {
                if ($(".rsFullscreenIcn").hasClass("rsFS")) {
                    $('#picForm').fadeOut('fast');
                    $('#form-shell').fadeOut('fast');
                    $('#grayout').fadeOut('fast');
                    $(".rsFullscreenIcn").removeClass("rsFS");
                }
                
            });
            */

            /*
            $(".xClose").click(function(e) {
                $('#picForm').fadeOut('fast');
                $('#form-shell').fadeOut('fast');
                $('#grayout').fadeOut('fast');
            });
           

            $("#villaMainImage").click(function(e) {
                $("#featuredImage").slideUp();
                $("#listingCarousel").slideDown();
                $("#closeCarousel").slideDown();
                
            });

            $("#closeCarousel").click(function (e) {
                $("#featuredImage").slideDown();
                $("#listingCarousel").slideUp();
                $("#closeCarousel").slideUp();
                $("html, body").animate({ scrollTop: 0 }, "slow");

            });


 */
            $("#featuredImage").click(function() {
                $('#picForm').fadeIn('fast');
                $('#form-shell').fadeIn('fast');
                $('#grayout').fadeIn('fast');
                $(".rsFullscreenIcn").click();
                $(".rsFullscreenIcn").addClass("rsFS");
                
                //var slider = $(".royalSlider").data('royalSlider');
                //slider.enterFullscreen();
            });


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
                alert('hitting this');
            });

            /*
            var myRates = tc.myRates;

            var rateStartDate = "";
            var rateEndDate = "";

            if (myRates !== undefined) {
                var displayRates = "<h2>Rates</h2>";
                displayRates = displayRates + '<br/><span id="currentCurrency" style="display:inline;">Prices are displayed in: ($) USD</span><br/><br/>';

                displayRates = displayRates + "<select id='currencyType' class='form-control' style='width:310px;display:inline;'>" +
                    "<option value='0'>Select Currency</option>" +
                                                    "<option value='USD'>$ - U.S. Dollars </option>" +
                                                    "<option value='CHF'>&#8355; - Swiss Franc</option>" +
                                                    "<option value='EUR'>&euro; - Euro</option>" +
                                                    "<option value='GBP'>&#xa3; - British Pound</option>" +
                                                    "<option value='JPY'>&yen; - Yen</option>" +
                                                    "<option value='CAD'>$ - Canadian Dollar</option></select>" ;
                var alt = "";
                $("#rateCount").val(myRates.length);

                

                displayRates = displayRates + '<div class="row header ">' +
                   '<div class="col-md-7 col-sm-7 col-xs-7" style="font-weight:700">Date Range</div>' +
                    '<div class="col-md-3 col-sm-3 col-xs-3" style="font-weight:700">Nightly Rate</div>' +
                    '<div class="col-md-2 col-sm-2 col-xs-2" style="font-weight:700">Min Stay</div>' +
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
                            '<div class="col-md-7 col-sm-7 col-xs-7 rowStyle">' + rateStartDate + ' - ' + rateEndDate + '</div>' +
                            '<div class="col-md-3 col-sm-3 col-xs-3 rowStyle">' + "$" + Number(myRates[j].rateAmount).toLocaleString('en').replace(".00", "") + '</div>' +
                            '<div class="col-md-2 col-sm-2 col-xs-2 rowStyle">' + myRates[j].minStay + '</div>' +
                            '</div>';
                    }

                }
            }

            $("#rateListing").html(displayRates);

            */
            
           

            $("#currencyType").change(function() {
                GetListingRatesByCurrCode($("#currencyType").val());//TODO:check this out !!!!!
            });



            var myFees = tc.myFees;


            if (myFees != undefined) {
                var displayFees = "<div class='ecTitle'>Fees</div>";
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

                   
                    displayFees = displayFees + "<div class='row'><div class='col-sm-3'><div class='feeType'>" + feeTypeDisplay + "</div></div><div class='col-sm-3'><div class='feeAmount'>" + "$" + Number(myFees[i].feeAmount).toLocaleString('en').replace(".00", "") + '</div></div></div>';
                }

                if (tc.taxPercentage !== 0 && tc.taxPercentage !== "") {
                    displayFees = displayFees + "<div class='row'><div class='col-sm-3'><div class='feeType'>Tax:</div></div><div class='col-sm-3'><div class='feeAmount'>" + tc.taxPercentage + '%</div></div></div>';
                }

                if (tc.serviceFee !== 0 && tc.serviceFee!=="") {
                    displayFees = displayFees + "<div class='row'><div class='col-sm-3'><div class='feeType'>Service Fee:</div></div><div class='col-sm-3'><div class='feeAmount'>" + tc.serviceFee + '%</div></div></div>';
                }

                $("#feeListing").html(displayFees);
            }

            $("html, body").animate({ scrollTop: "5px" });
            PopulateListingAmenities(myId);
            PopulateTopListingAmenities(myId);
            GetListingBedrooms(myId);
            GetListingBathrooms(myId);
            GetListingPolicies(myId);
            GetListingAccesibility(myId);
            GetListingPOI(myId);

            var defCurr = getCookie("defaultCurrency");

            if (defCurr !== "") {
                GetListingRatesByCurrCode(defCurr);
            } else {
                GetListingRatesByCurrCode(tc.baseCurrency);
            }


            //bedrooms
            //bathrooms
            //policies

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });



}

function GetListingPOI(id) {
    var data = "{listingId:'" + id + "'}";
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
            myPoi = '<div class="ecTitle">Points of Interest</div>';
            for (var i = 0; i < tc.length; i++) {
                myPoi = myPoi  +'<div class="ecPol">' + tc[i].poiTitle + '</div>';
            }

            $(document).on("click", ".poiRemove", function (event) {
                DeletePOI(this.id);
            });

           

            $("#poiListingSection").html(myPoi);

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
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

    //return dispMonth + " " + day + ", " + yr;
    return thisDate;

}
function UpdateFeesAndBottom(conversion,currType)
{
    $("#listingDetail").css("display", "inline");
    $("#grayout").fadeTo(50, 0.2);

    var listingDetails = "";



    var data = "{listingId:'" + $("#unitId").val() + "'}";

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

            //bottom box
            $(".listing-summary").html(dollar + Number(tc.rateMin * conversion).toLocaleString('en').replace(".00", "") + " - " + dollar + Number(tc.rateMax * conversion).toLocaleString('en').replace(".00", "") + " / Per Night");
            //fees


            var myFees = tc.myFees;


            if (myFees != undefined) {
                var displayFees = "<div class='ecTitle'>Fees</div>";
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


                    displayFees = displayFees + "<div class='row'><div class='col-sm-3'><div class='feeType'>" + feeTypeDisplay + "</div></div><div class='col-sm-3'><div class='feeAmount'>" + dollar + Number(myFees[i].feeAmount * conversion).toLocaleString('en').replace(".00", "") + '</div></div></div>';
                }

               /* if (tc.taxPercentage !== 0 && tc.taxPercentage !== "") {
                    displayFees = displayFees + "<div class='row'><div class='col-sm-3'><div class='feeType'>Tax:</div></div><div class='col-sm-3'><div class='feeAmount'>" + tc.taxPercentage + '%</div></div></div>';
                }

                if (tc.serviceFee !== 0 && tc.serviceFee !== "") {
                    displayFees = displayFees + "<div class='row'><div class='col-sm-3'><div class='feeType'>Service Fee:</div></div><div class='col-sm-3'><div class='feeAmount'>" + tc.serviceFee + '%</div></div></div>';
                }
                */

                $("#feeListing").html(displayFees);
            }


        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });



}

function GetListingFeesByCurrCode(currType) {
    //getCurrencyConversion
    var data = "{currType:'" + currType + "'}";
    $.ajax({
        type: "POST",
        data: data,
        url: "/Home/GetCurrencyConversion",
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

            var myConversion = Number(tc.conversionRate);
            //if (currType !== "USD") {
                setCookie("defaultCurrency", currType, 180);
            //}
            
            UpdateFeesAndBottom(myConversion,currType);



        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

    
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
                var displayRates = "<div class='ecTitle' id='rateAnchor'>Rates</div>";
                 displayRates = displayRates + '<br/><span id="currentCurrency" style="display:inline;">Prices are displayed in: (' + dollar + ') ' + currType +'</span><br/><br/>';
                displayRates = displayRates + "<select id='currencyType' class='form-control' style='width:310px;display:inline;'>" +
                    "<option value='0'>Select Currency</option>" +
                                                    "<option value='USD'>$ - U.S. Dollars </option>" +
                                                    "<option value='CHF'>&#8355; - Swiss Franc</option>" +
                                                    "<option value='EUR'>&euro; - Euro</option>" +
                                                    "<option value='GBP'>&#xa3; - British Pound</option>" +
                                                    "<option value='JPY'>&yen; - Yen</option>" +
                                                    "<option value='CAD'>$ - Canadian Dollar</option></select>";
                var alt = "";
                $("#rateCount").val(myRates.length);


                displayRates = displayRates + '<div class="row ecRowHeader ">' +
                  '<div class="col-md-3  col-sm-4 col-xs-5">Dates</div>' +
                  '<div class="col-md-2 col-sm-2 col-xs-2 mobNo">Type</div>' +
                   '<div class="col-md-2 col-sm-2 col-xs-4">Nightly Rate</div>' +
                   '<div class="col-md-2 col-sm-2 col-xs-3">Min Stay</div>' +
                   '<div class="col-md-3 col-sm-2 col-xs-2 mobNo">Cancellation Policy</div>' +
                   '</div>';

                var rateStartDate = "";
                var rateEndDate = "";
                var rateSpacer = "";


                for (var j = 0; j < myRates.length; j++) {

                    var xx = j % 2;
                    if (xx == 0) {
                        alt = " ecRowAlt ";
                    } else {
                        alt = "";
                    }
                    rateStartDate = "";
                    rateEndDate = "";
                    rateSpacer = " - ";
                    if (myRates[j].startDate !== "") {
                        rateStartDate = DateRateMe(myRates[j].startDate);
                        rateEndDate = DateRateMe(myRates[j].endDate);

                        if (rateStartDate == "01/01/00") {
                            rateStartDate = "";
                        }
                        if (rateEndDate == "01/01/00") {
                            rateEndDate = "";
                        }

                        if (myRates[j].rateType == "STANDARD") {
                            rateSpacer = " ";
                        }
                        displayRates = displayRates + '<div class="row ecRowItem' + alt + '">' +
                            '<div class="col-md-3 col-sm-4 col-xs-5 rowStyle">' + rateStartDate + rateSpacer + rateEndDate + '</div>' +
                            '<div class="col-md-2 col-sm-2 col-xs-2 rowStyle mobNo">' + myRates[j].rateType + '</div>' +
                            '<div class="col-md-2 col-sm-2 col-xs-4 rowStyle">' + dollar + Number(myRates[j].rateAmount).toLocaleString('en').replace(".00", "") + '</div>' +
                            '<div class="col-md-2 col-sm-2 col-xs-3 rowStyle">' + myRates[j].minStay + '</div>' +
                            '<div class="col-md-3 col-sm-2 col-xs-2 rowStyle mobNo">' + myRates[j].cancelDays + ' days</div>' +
                            '</div>';
                    }

                }

                $("#rateListing").html(displayRates);

                $("#currencyType").change(function () {
                    GetListingRatesByCurrCode($("#currencyType").val());//TODO:check this out !!!!!
                });

                GetListingFeesByCurrCode(currType);
            }
            
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
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
            $("#greyform").fadeTo(50, 0.8);
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
                amenityHeader = "<div class='ecTitle'>Suitability</div>";
            }
            var theAmenities = amenityHeader;

            for (var i = 0; i < tc.length; i++) {
                theAmenities = theAmenities + tc[i].amenityTitle + "<br/>";
            }

            $("#suitabilityListing").html(theAmenities);

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
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
            $("#greyform").fadeTo(50, 0.8);
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
                amenityHeader = "<div class='ecTitle'>Policies</div>";
            }
            var theAmenities = amenityHeader;

            for (var i = 0; i < tc.length; i++) {
                theAmenities = theAmenities  +"<div class='ecPol'>" + tc[i].amenityTitle + "</div>";
            }

            $("#policyListing").html(theAmenities);

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
    
}

function PopulateTopListingAmenities(listingId) {
    var data = "{listingId:'" + listingId + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingTopAmenities",
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
            var amenityStart = "";
            var amenityEnd = "";
            var amenityHeader = "";
            var amenityType = "";
            var amenityTypeDisplay = "";
            var amenityClass = "";
            amenityHeader = "<div class='col-sm-12'><div class='amenityHeader ecTitle'>__TYPE__</div>";

            var amenityTopHeader = "<div class='row amenityBotDet'><div class='col-sm-12'>";
            var theAmenityTop = amenityTopHeader;
            for (var zz = 0; zz < 9; zz++) {
                if (tc[zz].amenityClass == "") {
                    amenityClass = "icon-checked";
                } else {
                    amenityClass = tc[zz].amenityClass;
                }
                theAmenityTop = theAmenityTop + '<div class="col-md-4 col-sm-6 col-xs-12"><i class="ecAmenSpace ' + amenityClass + '"></i> ' + tc[zz].amenityTitle + "</div>";


            }

            theAmenityTop = theAmenityTop + "</div></div>";

            $("#ecAmenityTopDetails").html(theAmenityTop);


        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
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
            var amenityClass = "";
            amenityHeader = "<div class='col-sm-12'><div class='amenityHeader ecTitle'>__TYPE__</div>";

           

            var theAmenities = amenityStart;

            for (var i = 0; i < tc.length; i++) {

                if (amenityType !== tc[i].amenityType) {
                    amenityType = tc[i].amenityType;
                    theAmenities = theAmenities + "</div></div><div class='col-sm-12'>";
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
                    theAmenities = theAmenities + amenityHeader.replace("__TYPE__", amenityTypeDisplay);
                    if (tc[i].amenityClass == "") {
                        amenityClass = "icon-checked";
                    } else {
                        amenityClass = tc[i].amenityClass;
                    }
                    theAmenities = theAmenities + '<div class="col-md-4 col-sm-6 col-xs-12"><i class="ecAmenSpace  ' + amenityClass + '"></i> ' + tc[i].amenityTitle + "</div>";
                } else {
                    if (tc[i].amenityClass == "") {
                        amenityClass = "icon-checked";
                    } else {
                        amenityClass = tc[i].amenityClass;
                    }
                    theAmenities = theAmenities + '<div class="col-md-4 col-sm-6 col-xs-12"><i class="ecAmenSpace  ' + amenityClass + '"></i> ' + tc[i].amenityTitle + "</div>";
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

            $("#amenityListing").html("<div class='ecTitle'>Amenities:</div>" + theAmenities);
            
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
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
            myBathroomListing = "<div class='ecTitle'>Bathrooms</div><div class='row'>";

           
            for (var i = 0; i < tc.length; i++) {
                
                
                myBathroomListing = myBathroomListing + '<div  class="col-sm-12 col-xs-12 bedDiv"  id="bath-' + tc[i].bathroomId + '">' +
                    '<div class="bedDiv">' + tc[i].bathroomTitle + ' (' + tc[i].bathroomType + ')</div>' +
                    '<div class="ecDescBB" >' + tc[i].bathroomDescription + '</div>' +
                    '<div class="amenities amenitiesBB" style="width:200px; display:inline;" id="amen-Bathroom-' + tc[i].bathroomId + '">' + GetAmenityDisplay('Bathroom', tc[i].bathroomAmenities, tc[i].bathroomId) + '</div>' +
                    '<div class="ecSeparate"><hr/></div>'+
                    '</div>';
                
            }

            myBathroomListing = myBathroomListing + "</div>";

            $("#bathCount").val(tc.length);
            $("#bathroomListingSection").html(myBathroomListing);

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

            var amenList = "<div class='row' >";
            //myBedroomListing = "<div class='row'>";
            for (var i = 0; i < tc.length; i++) {
                
                amenList = amenList + '<div class="col-md-3 col-sm-6 col-xs-12"><i class="ecAmenSpace ' + tc[i].amenityClass + '"></i> ' +
                    tc[i].amenityTitle + '</div>';
            }

            amenList = amenList + "</div>";
            $("#amen-" + type + "-" + id).html(amenList);

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
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
            myBedroomListing = "<div class='ecTitle'>Bedrooms</div><br/><div class='row '>";
            for (var i = 0; i < tc.length; i++) {
                myBedroomListing = myBedroomListing + '<div class="col-sm-12 col-xs-12 bedDiv" id="bed-' + tc[i].bedroomId + '">' +
                    /* '<span><h3>BEDROOM #' + parseInt(parseInt(i) + 1) + '</h3></span>' +*/
                    '<div class="ecTitleBB">' + tc[i].bedroomTitle + '</div>';
                    
                myBedroomListing = myBedroomListing + "<div style='display:inline'>Beds: </div>";
                if (tc[i].kingBed !== 0 && tc[i].kingBed !== "0") {
                    myBedroomListing = myBedroomListing + '<div class="bedSpan">(' + tc[i].kingBed + ') King&nbsp;&nbsp;</div>';
                }
                if (tc[i].queenBed !== 0 && tc[i].queenBed !== "0") {
                    myBedroomListing = myBedroomListing + '<div class="bedSpan">(' + tc[i].queenBed + ') Queen&nbsp;&nbsp;</div>';
                }
                if (tc[i].doubleBed !== 0 && tc[i].doubleBed !== "0") {
                    myBedroomListing = myBedroomListing + '<div class="bedSpan">(' + tc[i].doubleBed + ') Double&nbsp;&nbsp;</div>';
                }
                if (tc[i].twinBed !== 0 && tc[i].twinBed !== "0") {
                    myBedroomListing = myBedroomListing + '<div class="bedSpan">(' + tc[i].twinBed + ') Twin&nbsp;&nbsp;</div>';
                }
                if (tc[i].bunkBed !== 0 && tc[i].bunkBed !== "0") {
                    myBedroomListing = myBedroomListing + '<div class="bedSpan">(' + tc[i].bunkBed + ') Bunk&nbsp;&nbsp;</div>';
                }
                if (tc[i].childBed !== 0 && tc[i].childBed !== "0") {
                    myBedroomListing = myBedroomListing + '<div class="bedSpan">(' + tc[i].childBed + ') Child&nbsp;&nbsp;</div>';
                }
                if (tc[i].futonBed !== 0 && tc[i].futonBed !== "0") {
                    myBedroomListing = myBedroomListing + '<div class="bedSpan">(' + tc[i].futonBed + ') Futon&nbsp;&nbsp;</div>';
                }
                if (tc[i].murphyBed !== 0 && tc[i].murphyBed !== "0") {
                    myBedroomListing = myBedroomListing + '<div class="bedSpan">(' + tc[i].murphyBed + ') Murphy&nbsp;&nbsp;</div>';
                }
                if (tc[i].cribBed !== 0 && tc[i].cribBed !== "0") {
                    myBedroomListing = myBedroomListing + '<div class="bedSpan">(' + tc[i].cribBed + ') Crib&nbsp;&nbsp;</div>';
                }

                myBedroomListing = myBedroomListing + '<div class="ecDescBB">' + tc[i].bedroomDescription + '</div>';
                

                myBedroomListing = myBedroomListing + '<div class="amenities amenitiesBB" id="amen-Bedroom-' + tc[i].bedroomId + '">' + GetAmenityDisplay('Bedroom', tc[i].bedroomAmenities, tc[i].bedroomId) + '</div>';
                myBedroomListing = myBedroomListing + '<div class="ecSeparate"><hr/></div>';

                myBedroomListing = myBedroomListing + '</div>';
            }

            myBedroomListing = myBedroomListing + "</div>";

            $("#bedCount").val(tc.length);
            
            $("#bedroomListingSection").html(myBedroomListing);

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
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
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}
