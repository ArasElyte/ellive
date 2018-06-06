if (window.performance && window.performance.navigation.type == window.performance.navigation.TYPE_BACK_FORWARD) {
    
    setTimeout(function () { $(window).scrollTop(0); }, 1000);
}

$(document).ready(function () {
    var myCriteria = url_query("q");
    SearchTheListings(myCriteria);

    $("#searchButton").click(function() {
        var sCriteria = $("#searchListings").val();
        SearchTheListings(sCriteria);
    });


    $(".ecSearchFilter").click(function () {
        var sCriteria = $("#searchDest").val();
        SearchTheListings(sCriteria);
    });

    $(document).keypress(function (e) {
        if (e.which == 13) {
            // enter pressed
            var sCriteria = $("#searchDest").val();
            SearchTheListings(sCriteria);
        }
    });

    $("#searchDepart").datepicker();
    $("#searchArrive").datepicker();
});//end doc ready

function SearchTheListings(myCriteria) {

    if (myCriteria == "" || myCriteria==false) {
        myCriteria = "AllProp";
    }

    var data = "{searchCriteria:'" + decodeURIComponent(myCriteria) + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingResults",
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
             
            //TODO: if no results returned, display message
            $("#numResults").html(tc.length);
            if (tc.length == 0) {
                myListings = myListings + "<div class='noListings'>There were no listings found for the specified search criteria!</div>";
            }
            for (var i = 0; i < tc.length; i++) {

          


                myListings = myListings + '<div class="col-md-6 col-sm-12 col-xs-12" style="margin:0px;padding:0px;">' +
                        '<div class="thingsBox thinsSpace imgClick"  id="' + tc[i].unitId + '">' +
                            '<div class="thingsImage" style="background-size: cover; background-position: center;background:url(../img/properties/' + tc[i].displayImage +')">' +
                                '<img style="cursor:pointer" src="../img/properties/' + tc[i].displayImage + '"  width="100%" alt="Image Listings">' +
                                '<div class="thingsMask thingsMaskSearch ecMask">' +
                                    '<div class="ecFPTitle">' + tc[i].title + ' </div></a>' +
                                    '<div class="ecFPText">' + ' <span class="cityName">' + tc[i].city + ', ' + tc[i].country + ' <div class="ecPriceSearch ecPrice ecPriceSearch">From $<span>' + Number(tc[i].displayRate).toLocaleString('en').replace(".00", "") + '</span> /NT</div>' + '</div>' +
                                    '<div class="ecSearchCaption ecThingsCaption captionItem">' +
                                        '<ul class="list-inline ecFeatListDetails">' +
                                            '<li><div class="ecLI"><div class="ecLIinner">' + tc[i].maxOccupancy + '</div>  <img class="ecIco " src="../assets/svg/person.svg"/></div> </li>' +
                                            '<li><div class="ecLI"><div class="ecLIinner"> ' + tc[i].numBedrooms + '</div>  <img class="ecIco " src="../assets/svg/bed.svg"/></div> </li>' +
                                            '<li><div class="ecLI"><div class="ecLIinner"> ' + tc[i].numBathrooms + '</div><img class="ecIco " src="../assets/svg/bath.svg"/></div> </li>' +
                                         '</ul>' +
                                    '</div>' +
                                 '</div>' +
                             '</div>' +
                        '</div>' +
                    '</div>';



            }

            $("#listingResults").html(myListings);

            $(".imgClick").click(function () {
                var id = this.id;
                GetListingDetail(id);
            });

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}



function GetListingDetail(myId) {

    // $("#listingDetail").css("display", "inline");
    // $("#grayout").fadeTo(50, 0.2);

    var listingDetails = "";

    window.open("listing-details.html?lid=" + myId);

}