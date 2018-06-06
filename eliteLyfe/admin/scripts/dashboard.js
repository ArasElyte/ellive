$(document).ready(function() {

    var validUser = CheckAuth();

    if (validUser) {
        GetListingCounts();
        GetNewCurrency();
       // GetMessages();
    }

});//end doc ready

function GoToListings(type) {
   // alert(type);
    window.location = "listings.html?type=-" + type +"-";
}

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



function GetListingCounts() {


    $.ajax({
        type: "POST",
        url: "../Home/GetListingCounts",
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

            var myCurrencyListing = "<table style='width:100%;font-size:24px;line-height:46px'>";

            for (var i = 0; i < msg.length; i++) {
                myCurrencyListing = myCurrencyListing + '<tr>';

                switch (tc[i].listingCode) {
                    case "Active":
                        myCurrencyListing = myCurrencyListing + '<td ><a id="activeListings" onclick ="GoToListings(' + "'" + 'active' + "'" + ')" class="label label-success"> <i class="fa fa-check-square"></i>&nbsp;&nbsp;' + tc[i].listingCode + ' (' + tc[i].listingCount + ')' + '</a></td>' + '</tr>';
                        break;
                    case "Ghost":
                        myCurrencyListing = myCurrencyListing + '<td><a id="ghostListings"  onclick ="GoToListings(' + "'" + 'ghost' + "'" + ')"  class="label label-default"> <i class="fa fa-eye-slash"></i>&nbsp;&nbsp;' + tc[i].listingCode + ' (' + tc[i].listingCount + ')' + '</a></td>' + '</tr>';
                        break;
                    case "Inactive":
                        myCurrencyListing = myCurrencyListing + '<td><a id="inactiveListings" onclick ="GoToListings(' + "'" + 'inactive' + "'" + ')"   class="label label-warning"> <i class="fa  fa-times-circle-o"></i>&nbsp;&nbsp;' + tc[i].listingCode + ' (' + tc[i].listingCount + ')' + '</a></td>' + '</tr>';
                        break;
                    case "Incomplete":
                        myCurrencyListing = myCurrencyListing + '<td><a id="incompleteListings"  onclick ="GoToListings(' + "'" + 'incomplete' + "'" + ')"  class="label label-danger"> <i class="fa fa-info"></i>&nbsp;&nbsp;' + tc[i].listingCode + ' (' + tc[i].listingCount + ')' + '</a></td>' + '</tr>';
                        break;
                    case "Pending":
                        myCurrencyListing = myCurrencyListing + '<td><a id="pendingListings"  onclick ="GoToListings(' + "'" + 'pending' + "'" + ')"  class="label label-info"> <i class="fa fa-certificate"></i>&nbsp;&nbsp;' + tc[i].listingCode + ' (' + tc[i].listingCount + ')' + '</a></td>' + '</tr>';
                        break;
                      default :
                          myCurrencyListing = myCurrencyListing + '<td><a id="defaultListings"  class="label label-default">??? ' + ' (000)</a></td>' + '</tr>';




                }
                
            }

            //
            myCurrencyListing = myCurrencyListing + '</table>';

            $("#listingCountResults").html(myCurrencyListing);
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });

    //<h3 id="totalListings">71,503</h3>

    //GetListingCounts
    //goes into this element
    $("#listingCountResults").html();

    
}

function GetUpdatedCurrency( date, usd, eur, cad, gbp, jpy, chf) {

    //call currency WS, (see if we have latest, if not update)

    //exec updateCurrency '04/23/1981','1','0.84196','1.2708','0.75036','111.34','0.98089'
    var data = "{rateDate:'" + date + "',USD:'" + usd + "',EUR:'" + eur + "',CAD:'" + cad + "',GBP:'" + gbp + "',JPY:'" + jpy + "',CHF:'" + chf + "'}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        data:data,
        url: "/Home/UpdateCurrency",
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

            var lstUpd = "";
            var myCurrencyListing = "<table style='width:100%;'><tr><td colspan='2' style='font-weight:700;text-decoration:underline;'>Code</td><td style='font-weight:700;;text-decoration:underline;'>Title</td><td style='font-weight:700;;text-decoration:underline;'>Conversion</td></tr>";

            for (var i = 0; i < msg.length; i++) {
                myCurrencyListing = myCurrencyListing + '<tr>';

                switch (tc[i].currencyCode) {
                    case "USD":
                        myCurrencyListing = myCurrencyListing + "<td>$</td>";
                        break;
                    case "CHF":
                        myCurrencyListing = myCurrencyListing + "<td>&#8355;</td>";
                        break;
                    case "EUR":
                        myCurrencyListing = myCurrencyListing + "<td>&euro;</td>";
                        break;
                    case "GBP":
                        myCurrencyListing = myCurrencyListing + "<td>&#xa3;</td>";
                        break;
                    case "JPY":
                        myCurrencyListing = myCurrencyListing + "<td>&yen;</td>";
                        break;
                    case "CAD":
                        myCurrencyListing = myCurrencyListing + "<td>$</td>";
                        break;
                    default:
                        break;
                }

                myCurrencyListing = myCurrencyListing + '<td>' + tc[i].currencyCode + '</td>' +
                    '<td>' + tc[i].currencyTitle + '</td>' +
                    '<td>' + tc[i].currencyAmount + '</td>' +
                  
                    '</tr>';
                lstUpd = tc[i].lastUpdate;

            }
            myCurrencyListing = '<h6>Last Update:  ' + lstUpd +'</h6>' + myCurrencyListing + '</table>';

            $("#currencyListing").html(myCurrencyListing);
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });


    
}

function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // note parts[1]-1
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

function GetMessages() {

    var data = "{messageStatus:''}";

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetFormSubmissions",
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
            var tc = msg;
            var messageHTML = "";

            if (tc.length !== 0) {
              
                var alt = "";
              
                messageHTML = messageHTML + '<ul class="list-unstyled panel-list">';



                for (var j = 0; j < tc.length; j++) {

                    var xx = j % 2;
                    if (xx == 0) {
                        alt = "altRow";
                    } else {
                        alt = "";
                    }
                    messageHTML = messageHTML + '<li class="messageCommon recentMessage listWrapper"><a class="messagLink href="#">' +
                        '<span class="messageInfo">' +
                        '<p><span class="msgStatus ' + tc[j].status + '">' + tc[j].status + '</span><br/><small><span class="dayTime">' + tc[j].createdOn + '</span></small></p>' +
                        '<h5>' + tc[j].firstName + ' ' + tc[j].lastName + '</h5>' +
                        '<p>' +
                        'Email: ' + tc[j].email + '<br/>' +
                        'Phone: ' + tc[j].phone + '<br/>' +
                        'Travel To: ' + tc[j].travelTo + '<br/>' +
                        'Dates: ' + tc[j].monthToGo + '<br/>' +
                        'Budget: ' + tc[j].budget + '<br/>' +
                        'Occasion: ' + tc[j].occasion + '<br/>' +
                        'Page: ' + tc[j].submissionPage + '<br/>' +
                        '</p>' +
                        '</span></a>' +
                        '</li>';
                }

                messageHTML = messageHTML + "</ul>";

                $("#messageList").html(messageHTML);
            }

        },
        error: function(msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }

    });
}

function GetNewCurrency() {
    $.ajax({
        type: "GET",
        //data: JSON.stringify(model),
        url: "https://api.fixer.io/latest?base=usd",
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
           
            var rateBase = msg.base;
            var rateDate = msg.date;
            var rateRates = msg.rates;

            var USD = 1;
            var EUR = 0;
            var CAD = 0;
            var GBP = 0;
            var JPY = 0;
            var CHF = 0;
            var THB = 0;


          
                EUR = rateRates.EUR;
                CAD = rateRates.CAD;
                GBP = rateRates.GBP;
                JPY = rateRates.JPY;
                CHF = rateRates.CHF;

                GetUpdatedCurrency(rateDate, USD, EUR, CAD, GBP, JPY, CHF);


           
        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}