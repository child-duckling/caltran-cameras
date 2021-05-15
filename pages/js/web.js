$(document).on("click", "a", function() {
    //this == the link that was clicked
    var href = $(this).attr("href");
    alert("You're trying to go to " + href);
});