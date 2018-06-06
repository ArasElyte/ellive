$(document).ready(function () {
    SearchTheListings(" ");


});


function SearchTheListings( searchVal) {

    var myCriteria = searchVal;

    var data = "{searchCriteria:'" + myCriteria + "'}";

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
            var myListingHeader = '<div class="row">';
           // var myListingHeader = "";
                       
            var myListings = myListingHeader;


            //TODO: if no results returned, display message
            for (var i = 0; i < tc.length; i++) {

                myListings = myListings + '<div class="col-sm-6 col-xs-12">' +
                    '<div class="thingsBox thinsSpace">' +
                    '<div class="thingsImage">' +
                    '<img src="../img/properties/' + tc[i].displayImage + '" width="100%" style="height:380px" alt="' + tc[i].title + '">' +
                    '<div class="thingsMask">' +
                    '<ul class="list-inline rating">' +
                    '<li><i class="fa fa-star" aria-hidden="true"></i></li>' +
                    '<li><i class="fa fa-star" aria-hidden="true"></i></li>' +
                    '<li><i class="fa fa-star" aria-hidden="true"></i></li>' +
                    '<li><i class="fa fa-star" aria-hidden="true"></i></li>' +
                    '<li><i class="fa fa-star" aria-hidden="true"></i></li>' +
                    '</ul>' +
                    '<a href="blog-details.html"><h2>' + tc[i].title + ' <i class="fa fa-check-circle" aria-hidden="true"></i></h2></a>' +
                    '<p>' + tc[i].address1 + ' ' + tc[i].address2 + ' ' + tc[i].city + ',' + tc[i].stateProv + ' ' + tc[i].zipPostal + '</p>' +
                    '</div>' +
                    '</div>' +
                    '<div class="thingsCaption ">' +
                    '<ul class="list-inline captionItem">' +
                    '<li><i class="fa fa-heart-o" aria-hidden="true"></i> 10 k</li>' +
                    '<li><a href="#" onclick="GetListingDetail(' + tc[i].unitId + ')">Edit Listing</a></li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>';


            }

           // myListings = myListings + '</div>';

            // alert("yay!");

            $("#listingResults").html(myListings);

        },
        error: function (msg) {
            alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function GetListingDetail(myId) {
    window.location = "edit-listings.html?lid=" + myId;

}