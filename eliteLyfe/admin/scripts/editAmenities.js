$(document).ready(function() {


    $("#Allproducts, #SelectedProducts").sortable({
        connectWith: ".connectedSortable"
    }).disableSelection();


});//end doc ready