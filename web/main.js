document.addEventListener('mousedown', function(e) {
    //var selectionActions = document.getElementsByClassName('selectionActions');
    var isSelected = document.getElementsByClassName('is-selected');
    if (isSelected.length != 0) {
        toggleActions('show');
    } else {
        toggleActions('hide');
    }
    //console.log(document.links)


});

function selectToast() {
    var snack = document.querySelector('.mdl-js-snackbar');
    var data = {
        name: 'Add to Favorites',
        actionHandler: getSelected(),
        actionText: 'Add to Favorites',
        timeout: 10000
    };
    snack.MaterialSnackbar.showSnackbar(data);
}

function toggleActions(a) {
    if (a == 'show') {
        document.getElementById("selectionActions").style = "";
        document.getElementById("table").style = "width:950px";
    } else {
        document.getElementById("selectionActions").style = "display: none";
        document.getElementById("table").style = "width:875px";
    }


}

function addToFavs() {
    console.log('aaaaaaaaaaaaaaaaa')


}

function getSelected() {
    var isSelected = document.getElementsByClassName('is-selected');
    for (var i; i >= isSelected.length; i++) {
        console.log(isSelected);

    }



}
document.addEventListener('load', () => {
    var now = new Date().valueOf();
    setTimeout(function() {
        if (new Date().valueOf() - now > 100) return;
        window.location = "https://itunes.apple.com/appdir";
    }, 25);
    window.location = "appname://";



})