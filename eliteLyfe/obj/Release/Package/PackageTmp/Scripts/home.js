
$(document).ready(function () {

    $('#searchButton').click(function (e) {
        SearchTheListings();
    });

    $("#searchBox").combobox();

});//end doc ready


function SearchTheListings() {

    var myCriteria = $("#searchBox").val();

    if (myCriteria == "" || myCriteria==false) {
        myCriteria = "AllProp";
    }
        window.location = "search-results.html?q=" + myCriteria;
   
}