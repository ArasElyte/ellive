
$(document).ready(function () {

    $('#searchButton').click(function (e) {
        SearchTheListings($("#searchBox").val());
    });

    $(".ecSearchButton").click(function (e) {
        SearchTheListings($("#searchBox").val());
    });

    $("#searchButtonTop").click(function(e) {
        SearchTheListings($("#searchListings").val());
    });

    $(".carousel").carousel({
        interval: 4000
    });

    $("#closebtn").click(function () {
        navToggle();
    });

    $(".phoneNavMobile").click(function() {
        window.open("tel:18333585933");
    });
    

    // $("#searchBox").combobox();

    $(document).keypress(function (e) {
        if (e.which == 13) {
            // enter pressed
            var meHasFocus = $(document.activeElement);
            meHasFocus = meHasFocus[0].id;

            switch(meHasFocus) {
                case "searchBox":
                    SearchTheListings($("#searchBox").val());
                    break;
                case "searchListings":
                    SearchTheListings($("#searchListings").val());
                    break;
                default:
                    //DO Nothing (eventualy submit form)
            }
           // SearchTheListings($("#searchBox").val());
        }
    });

    /*$(".royalSlider").royalSlider({
            keyboardNavEnabled: true,
            autoScaleSlider: true,
            fullscreen: {
                enabled: true,
                nativeFS: false
            }
        });  
        */

    GetFeaturedListings();

    $('#index_would_like_to_go').editableSelect({ effects: 'slide' });
    $('#searchBox').editableSelect({ effects: 'slide' });
    

    
    $(".headerTitle").click(function () {
        if ($(".headerTitle").hasClass("3p")) {
            $(".headerTitle").addClass("1p").removeClass("3p");
            $(".homeBanner").css("background-image", "url(../img/banner/banner1.jpg)");
            return;
        }

        if ($(".headerTitle").hasClass("2p")) {
            $(".headerTitle").addClass("3p").removeClass("2p");
            $(".homeBanner").css("background-image", "url(../img/banner/banner3.jpg)");
            return;
        }


        if ($(".headerTitle").hasClass("1p")) {
            $(".headerTitle").addClass("2p").removeClass("1p");
            $(".homeBanner").css("background-image", "url(../img/banner/banner2.jpg)");
            return;
        }

    });



});//end doc ready





function GetFeaturedListings() {
    //

    $.ajax({
        type: "POST",
        //data: JSON.stringify(model),
        url: "/Home/GetFeaturedListingsForHomePage",
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

            //TODO: if no results returned, display message

            var htmlStart = "";

            var isActive = "";
            //divide by 3, add 1
            if (tc.length != 0) {
                htmlStart = "<div id='thumbnailSlider' class='carousel slide thumbnailCarousel'><ol class='carousel-indicators'>";

                for (var xx = 0; xx < (tc.length / 3) + 1 ; xx++) {
                    if (xx == 0) {
                        isActive = "active";
                    } else {
                        isActive = "";
                    }
                    htmlStart = htmlStart + '<li data-target="#thumbnailSlider" data-slide-to="' + xx + '" class="' + isActive + '"></li>';
                }
                
            }

            if (htmlStart != "") {
                htmlStart = htmlStart + "</ol>";
            }
            

            var htmlBody = "";

            if (htmlStart != "") {
                htmlBody = htmlStart + '<div class="carousel-inner"><div class="item row active">';
            }

            //$("#numResults").html(tc.length);
            var threeTimes = tc.length * 3;
            var showClass = "";

            var runTime = tc.length;
            var arrPos = 0;

            if (tc.length % 3 != 0) {
                runTime = threeTimes;
            }

            for (var i = 0; i < runTime; i++) {

                showClass = " hideMobile  ";
                arrPos = i;
                if (arrPos >= tc.length) {
                    arrPos = (arrPos % tc.length);
                    console.log(arrPos + "one");
                    if (arrPos == -1) {
                        arrPos = 0;
                    }
                    console.log(arrPos);
                }

             
 
                 if (arrPos == 0) {
                     showClass = " showMobie ";
                 }

                // arrPos = i;

                 myListings = myListings + "<a target='_blank' href='listing-details.html?lid=" + tc[arrPos].unitId + "'>" +
                    '<div class="col-md-4 col-sm-12 col-xs-12' + showClass + '" style="margin:0px;padding:0px;">' +
                        '<div class="thingsBox thinsSpace imgClick"  id="' + tc[arrPos].unitId + '">' +
                            '<div class="thingsImage">' +
                                //'<img style="cursor:pointer" src="../img/properties/' + tc[arrPos].displayImage.replace(".jpg", "_t.jpg") + '"  width="100%" alt="Image Listings">' +
                                '<img style="cursor:pointer" src="../img/properties/' + tc[arrPos].displayImage + '"  width="100%" alt="Image Listings">' +
                                '<div class="thingsMask ecMask">' +
                                    '<div class="ecFPTitle">' + tc[arrPos].title + ' </div></a>' +
                                    '<div class="ecFPText">' + ' <span class="cityName">' + tc[arrPos].geoSubText3 + ',' + tc[arrPos].geoSubText2 + '<div class="ecPrice">FROM $<span>' + Number(tc[arrPos].displayRate).toLocaleString('en').replace(".00", "") + '</span> /NT</div>' +'</div>' +
                                    '<div class="ecThingsCaption captionItem">' +
                                        '<ul class="list-inline ecFeatListDetails">' +
                                            '<li><div class="ecLI"><div class="ecLIinner">' + tc[arrPos].maxOccupancy + '</div>  <img class="ecIco" src="../assets/svg/person.svg"/></div> </li>' +
                                            '<li><div class="ecLI"><div class="ecLIinner"> ' + tc[arrPos].numBedrooms + '</div>  <img class="ecIco" src="../assets/svg/bed.svg"/></div> </li>' +
                                            '<li><div class="ecLI"><div class="ecLIinner"> ' + tc[arrPos].numBathrooms + '</div><img class="ecIco" src="../assets/svg/bath.svg"/></div> </li>' +
                                         '</ul>' +
                                    '</div>' +
                                 '</div>' +
                             '</div>' +
                        '</div>' +
                    '</div></a>';

                    

              /*  myListings = myListings +
                    '<div class="col-md-4 col-sm-12 col-xs-12' + showClass + '" style="margin:0px;padding:0px;">' +
                     "<a target='_blank' href='listing-details.html?lid=" + tc[arrPos].unitId + "'>" +
                    '<div class="thingsBox thinsSpace imgClick ecThingsBox"  id="' + tc[arrPos].unitId + '">' +
                    '<div class="thingsImage">' +
                    '<img style="cursor:pointer" src="../img/properties/' + tc[arrPos].displayImage + '"  width="100%" alt="Image Listings">' +
                    '<div class="thingsMask ecMask">' +
                    '<div class="ecFPTitle">' + tc[arrPos].title + ' </div></a>' +
                    '<div class="ecFPText">' + ' <span class="cityName">' + tc[arrPos].geoSubText3 + ',' + tc[arrPos].geoSubText2 + '<div class="ecPrice">FROM $<span>' + Number(tc[arrPos].displayRate).toLocaleString('en').replace(".00", "") + '</span> /NT</div>' +'</div>' +
                    '<div class="ecThingsCaption captionItem">' +
                    '<ul class="list-inline ecFeatListDetails">' +
                    '<li><span><div class="ecLI">' + tc[arrPos].maxOccupancy + '  </span><img src="../assets/all/svg/person.svg"/></div> </li>' +
                    '<li><span><div class="ecLI"></div> ' + tc[arrPos].numBedrooms + '  </span><img src="../assets/all/svg/bed.svg"/></div> </li>' +
                    '<li><span><div class="ecLI"></div> ' + tc[arrPos].numBathrooms + '</span><img src="../assets/all/svg/bath.svg"/></div> </li>' +
                    '<li> </li>' +
                    '</ul>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    
                    '</div></a>' +
                    '</div>';

                    */
               // threeTimes = threeTimes + 1;

                if (i != 0 && (i + 1) % 3 == 0) {
                    myListings = myListings + '</div><div class="item row">';
                  //  threeTimes = 0;
                }
            }

            myListings = htmlBody + myListings + "</div></div>";
            myListings = myListings + ' <a class="left carousel-control" href="#thumbnailSlider" data-slide="prev"><i class="fa fa-angle-left" aria-hidden="true"></i></a>' +
                '<a class="right carousel-control" href="#thumbnailSlider" data-slide="next"><i class="fa fa-angle-right" aria-hidden="true"></i></a></div>';
            myListings = myListings.replace('<div class="item row"></div>', '');
            $("#featuredListings").html(myListings);

            $('.carousel').carousel({
                interval: 15000
            });

            ///NEW CAROUSEL
            //border:1px solid black;background:white;



            var royalSlider = '<div id="featuredRS" class="royalSliderFeatured rsDefault" style="width:100%">';

            for (var i = 0; i < tc.length; i++) {


                royalSlider = royalSlider + "<div class='rsContent'><a target='_blank' href='listing-details.html?lid=" + tc[i].unitId + "'>" +
                  
                    '<div class="thingsBox-x thinsSpace-x imgClick-x "  id="' + tc[i].unitId + '">' +
                    '<div class="thingsImage-x">' +
                    '<img style="cursor:pointer" class="rsImgxx" src="../img/properties/' + tc[i].displayImage.replace(".jpg", "_t.jpg") + '" height="500px" >' +
                    '<div class="thingsMask">' +
                    '<h2>' + tc[i].title + ' </h2></a>' +
                    '<p>' + ' <span class="cityName">' + tc[i].geoSubText3 + ',' + tc[i].geoSubText2 + '</p>' +
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
                    '</div></a></div>';

                
            }

            royalSlider = royalSlider + '</div>';

           // $("#featuredListings").html(royalSlider);



            $(".royalSliderFeatured").royalSlider({
                // general options go gere
                addActiveClass: true,
                arrowsNav: false,
                controlNavigation: 'none',
                autoScaleSlider: true,
                autoScaleSliderWidth: 960,
                loop: true,
                fadeinLoadedSlide: false,
                globalCaption: true,
                keyboardNavEnabled: true,
                globalCaptionInside: false,
                visibleNearby: {
                    enabled: true,
                    centerArea: 0.6,
                    center: true,
                    breakpoint: 0,
                    breakpointCenterArea: 0.64,
                    navigateByCenterClick: true
                }, autoPlay: {
                    // autoplay options go gere
                    enabled: true,
                    pauseOnHover: true,
                    delay:6000
                }
            });


           // $(".imgClick").click(function () {
           //     var id = this.id;
            //    GetListingDetail(id);
           // });

        },
        error: function (msg) {
            //alert("something went wrong! " + msg.exception);
            //error yo
        }
    });
}

function SearchTheListings(searchCriteria) {

    var myCriteria = searchCriteria;

    if (myCriteria == "" || myCriteria==false) {
        myCriteria = "AllProp";
    }
        window.location = "search-results.html?q=" + myCriteria;
   
}

/*
var nav = document.getElementById("topNav");
var main = document.getElementById("main");
var menu = document.getElementsByClassName("menuitems");
var close = document.getElementById("closebtn");

//default to measure if/else from
nav.style.height = "50px";
main.style.marginTop = "50px";
for (i = 0; i < menu.length; i++) { menu[i].style.marginTop = "100px"; };

close.addEventListener("click", function () {
    var menuIcon = close.children;
    for (i = 0; i < menuIcon.length; i++) {
        menuIcon[i].classList.toggle("active");
    }
});

function navToggle() {
    //to close
    if (nav.style.height <= "275px") {
        nav.style.height = "50px";
        main.style.marginTop = "50px";

        var i = 0;
        for (i = 0; i < menu.length; i++) {
            menu[i].style.opacity = "0.0";
            menu[i].style.marginTop = "100px";
        };
        document.body.style.backgroundColor = "rgba(0,0,0,0.0)";

    }
        //to open
    else if (nav.style.height <= "50px") {
        nav.style.height = "275px";
        main.style.marginTop = "275px";
        var i = 0;
        for (i = 0; i < menu.length; i++) {
            menu[i].style.opacity = "1.0";
            menu[i].style.marginTop = "0px";
        };
        document.body.style.backgroundColor = "rgba(0,0,0,0.4)";

    }

};
*/