$(document).ready(function() {
    var myCriteria = url_query("q");
    SearchTheListings(myCriteria);

    $("#searchButton").click(function() {
        var sCriteria = $("#searchListings").val();
        SearchTheListings(sCriteria);
    });
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
             
            //TODO: if no results returned, display message
            $("#numResults").html(tc.length);
            for (var i = 0; i < tc.length; i++) {

                myListings = myListings + '<div class="col-md-4 col-sm-6 col-xs-12">' +
                    '<div class="thingsBox thinsSpace imgClick"  id="' + tc[i].unitId + '">' +
                    '<div class="thingsImage">' +
                    '<img style="cursor:pointer" src="../img/properties/' + tc[i].displayImage + '" height=" width="100%" alt="Image Listings">' +
                    '<div class="thingsMask">' +
                    '<h2>' + tc[i].title + ' </h2></a>' +
                    '<p>' + tc[i].address1 + ' ' + tc[i].address2 + ' <span class="cityName">' + tc[i].city + ',' + tc[i].stateProv + " " + tc[i].zipPostal + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="thingsCaption captionItem">' +
                    '<ul class="list-inline ">' +
                    '<li><span class="bigText"><i class="icon-user3"></i> ' + tc[i].maxOccupancy + ' | </span></li>' +
                    '<li><span class="bigText"><i class="icon-bed"></i> ' + tc[i].numBedrooms + ' | </span></li>' +
                    '<li><span class="bigText"><i class="icon-bathtub"></i> ' + tc[i].numBathrooms + '</span></li>' +
                    '<li><div class="price">FROM <sup>$</sup><span class="bigText">' + Number(tc[i].displayRate).toLocaleString('en').replace(".00", "") + '</span> /NT</div> </li>' +
                    '</ul>' +
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
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}



function GetListingDetail(myId) {

    // $("#listingDetail").css("display", "inline");
    // $("#grayout").fadeTo(50, 0.2);

    var listingDetails = "";

    window.location = "listing-details.html?lid=" + myId;
    
}