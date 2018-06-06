$(document).ready(function () {

    CheckAuth();

    var type = url_query('type');

    if (!type) {
        type = "";
    }

    GetListingByType(type);

    //TODO: hack to remove toolbar - investigate later
    setTimeout(function () {
        $(".btn-toolbar").css("display", "none");
    }, 300);

 


});

function CheckAuth() {
    var meCookie = getCookie("simpleAuth");
    if (meCookie) {
        $("#welcomeUser").html(meCookie);
    } else {
        window.location = "index.html";
    }
}


function GetListingByType(type) {

    var data = "{type:'" + type + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetListingByType",
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
            //var myListingHeader = '<div class="row">';
             var myListingHeader = "";

            var myListings = myListingHeader;


            //TODO: if no results returned, display message
            for (var i = 0; i < tc.length; i++) {

                

                myListings = myListings + '<tr class="rowItem">' +
                    '<td>' +
                    '<ul class="list-inline listingsInfo">' +
                    
                    '<li><a style="cursor:pointer" href="edit-listings.html?lid=' + tc[i].unitId + '"><img src="../img/properties/' + tc[i].displayImage + '" style="max-height:135px;max-width:200px" alt="' + tc[i].title + '"></a></li>' +
                    '<li>' +
                    '<!--<h6 style="font-weight:700;padding-bottom:10px">' + tc[i].title + ' <i class="fa fa-check-circle" aria-hidden="true"></i></h6>-->' +
                    '<h5 style="padding-top:10px">' + tc[i].address1 + ' ' + tc[i].address2 + '<br/> <span class="cityName">' +  tc[i].city + '<!--,' + tc[i].stateProv + ' ' + tc[i].zipPostal + '--></span></h5>' +
                    '<span class="category">' + tc[i].listingType + '</span>' +
                    '<p>From $' + tc[i].displayRate +' /Night <span class="likeArea"><i class="fa fa-heart-o" aria-hidden="true"></i>10k</span></p>' +
                    '</li>' +
                    '</ul>' +
                    '</td>' +
                    '<td><i class="fa fa-check primaryColor" aria-hidden="true"></i></td>' +
                    '<td>450</td>' +
                    '<td>' +
                    '<ul class="list-inline rating">' +
                    '<li><i class="fa fa-star" aria-hidden="true"></i></li>' +
                    '<li><i class="fa fa-star" aria-hidden="true"></i></li>' +
                    '<li><i class="fa fa-star" aria-hidden="true"></i></li>' +
                    '<li><i class="fa fa-star" aria-hidden="true"></i></li>' +
                    '<li><i class="fa fa-star-o" aria-hidden="true"></i></li>' +
                    '<li>(9)</li>' +
                    '</ul>' +
                    '</td>' +
                    '<td>15/12/2017 <br>9.15am</td>' +
                    '<td>Today <br>11.00am</td>' +
                    '<td><span class="label label-warning">Incomplete</span></td>' +
                    '</tr>';


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