$(document).ready(function () {

    CheckAuth();

    var type = url_query('type');

    if (!type) {
        type = "";
    } else {
        setTimeout(function () {
            $("#searchMyListings").val(type);
            $("#searchMyListings").keyup();
        }, 5000);
    }

    //GetListingByType(type);
    GetListingByType("");

    //TODO: hack to remove toolbar - investigate later
    setTimeout(function () {
        $(".btn-toolbar").css("display", "none");
    }, 300);



    $("#searchMyListings").keyup(function () {
        var filter = $(this).val();

        $("#listingResults tr").each(function () {
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).fadeOut();
            } else {
                if ($(this).hasClass("hideMe") == false) {
                    $(this).show();
                }
            }
        });
    });


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
            $("#greyform").fadeTo(50, 0.8);
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
            var statusClass = "";
            var featuredYN = "";

            //TODO: if no results returned, display message
            for (var i = 0; i < tc.length; i++) {

                featuredYN = "";

                    switch (tc[i].listingStatus) {
                        case "Active":
                            statusClass = 'label-success'; 
                            break;
                        case "Ghost":
                            statusClass = 'label-default';
                            break;
                        case "Inactive":
                            statusClass = 'label-warning';
                            break;
                        case "Incomplete":
                            statusClass = 'label-danger';
                            break;
                        case "Pending":
                            statusClass = 'label-info';
                            break;
                        default:
                            statusClass = 'label-default';
                    }

                    if (tc[i].featuredListing == "True") {
                        featuredYN = '<i class="fa fa-check primaryColor" aria-hidden="true"></i>Featured';
                    }


                myListings = myListings + '<tr class="rowItem">' +
                    '<td>' +
                    '<ul class="list-inline listingsInfo">' +
                    '<li><a style="cursor:pointer" href="edit-listings.html?lid=' + tc[i].unitId + '"><img src="../img/properties/' + tc[i].displayImage + '" style="max-height:135px;max-width:200px" alt="' + tc[i].title + '"></a></li>' +
                    '<li>' +
                    '<h5 style="font-weight:700;padding-bottom:10px">' + tc[i].title + ' <i class="fa fa-check-circle" aria-hidden="true"></i></h5>' +
                    '<h5 style="padding-top:10px">' + tc[i].address1 + ' ' + tc[i].address2 + '<br/> <span class="cityName">' + tc[i].city + '<!--,' + tc[i].stateProv + ' ' + tc[i].zipPostal + '--></span></h5>' +
                    '<span class="category">' + tc[i].listingType + '</span>' +
                    '<p>From $' + tc[i].displayRate + ' /Night</p>' + //' <span class="likeArea"><i class="fa fa-heart-o" aria-hidden="true"></i>10k</span></p>' +
                    '<p>' + tc[i].listingNumber + '</p>' +
                    '<p>' + tc[i].geoSubText1 + " | " + tc[i].geoSubText2 + " | " + tc[i].geoSubText3 + '</p>' +
                    '</li>' +
                    '</ul>' +
                    '</td>' +
                    '<td>' + featuredYN + '</td>' +
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


                    '<td><span class="label' + ' ' + statusClass +'">-' + tc[i].listingStatus + '-</span></td>' +
                    '</tr>';


            }

            // myListings = myListings + '</div>';

            // alert("yay!");

            $("#listingResults").html(myListings);

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

}

function GetListingDetail(myId) {
    window.location = "edit-listings.html?lid=" + myId;

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