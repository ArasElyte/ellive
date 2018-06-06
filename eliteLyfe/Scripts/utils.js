$(document).ready(function() {
    // $(".copyRight").html("Copyright &copy; " + getCopyrightYear() + " EliteLyfe - ");
    $("#searchButtonTop").click(function (e) {
        SearchListings($("#searchListings").val());
    });
});



function SearchListings(searchCriteria) {

    var myCriteria = searchCriteria;

    if (myCriteria == "" || myCriteria == false) {
        myCriteria = "AllProp";
    }
    window.location = "search-results.html?q=" + myCriteria;

}



function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}

function deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

