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
    if (isElectron()) {
        window.close();
        window.location('cal-cam://open');
    }
})


function isElectron() {
    // Renderer process
    if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
        return true;
    }

    // Main process
    if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
        return true;
    }

    // Detect the user agent when the `nodeIntegration` option is set to true
    if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
        return true;
    }

    return false;
}