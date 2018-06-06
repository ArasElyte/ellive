$(document).ready(function () {

   // $("#rateStartDate").datepicker();
   // $("#rateEndDate").datepicker();

    $("#addListing1").click(function() {

        //validate
        var errMsg = "<br/><br/>";
        var lTitle = $("#listingTitle").val();
        var lCat = $("#listingCategory").val();
        var lDesc = $("#listingDescription").val();
        //TODO: Use selectize and populae a different field in future
        //not required
        var lTags = $("#listingTags").val();

        if (lTitle == "") {
            errMsg = errMsg + "Title is required.<br/>";
        }
        if (lCat == "" || lCat == "0" ) {
            errMsg = errMsg + "Category is required.<br/>";
        }
        if (lDesc == "") {
            errMsg = errMsg + "Description is required.<br/>";
        }

        if (errMsg != "<br/><br/>") {
            $(".errMsg").html(errMsg);
        } else {
            $(".listingAddressInfo").slideDown("slow");
            $(".aboutInfo").css("display", "none");
            $(".errMsg").html("");
        }
        
    });

    $("#addListing2").click(function () {
        //validate
        var errMsg = "<br/><br/>";
        var lAdd = $("#listingAddress").val();
        var lAdd2 = $("#listingAddress2").val();
        var lCountry = $("#listingCountry").val();
        var lCity = $("#listingCity").val();
        var lState = $("#listingState").val();
        var lPostal = $("#listingPostal").val();
        var lLat = $("#listingLatitude").val();
        var lLong = $("#listingLongitude").val();
        var lCurr = $("#listingBaseCurrency").val();
        var lTax = $("#listingTaxPercentage").val();
        var lLocale = $("#listingLocale").val();


        if (lAdd == "") {
            errMsg = errMsg + "Address is required.<br/>";
        }
        if (lCountry == "" || lCountry == "0") {
            errMsg = errMsg + "Country is required.<br/>";
        }
        if (lCity == "") {
            errMsg = errMsg + "City is required.<br/>";
        }
        if (lState == "" || lState == "0") {
            errMsg = errMsg + "State/Prov is required.<br/>";
        }
        if (lPostal == "") {
            errMsg = errMsg + "Postal Code is required.<br/>";
        }
        if (lCurr == "" || lCurr == "0") {
            errMsg = errMsg + "Currency is required.<br/>";
        }
        if (lTax == "") {
            errMsg = errMsg + "Tax % is required.<br/>";
        }
        if (lLocale == "" || lLocale == "0") {
            errMsg = errMsg + "Locale is required.<br/>";
        }

        if (errMsg != "<br/><br/>") {
            $(".errMsg").html(errMsg);
        } else {
            $(".listingRateInfo").slideDown("slow");
            $(".listingAddressInfo").css("display", "none");
            $(".errMsg").html("");
        } 

    });


    $("#addListing3").click(function() {
        //TODO: need validation here - just move on for now
        $(".listingGalleryInfo").slideDown("slow");
        $(".listingRateInfo").css("display", "none");
        $(".submitNewListing").slideDown("slow");
        $(".errMsg").html("");
        //show submit here as well, since pics are optional.
    });

});