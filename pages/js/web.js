document.addEventListener('', () => {

    var handler = function(href) {
        new WinBox({ title: "Traffic Cam", url: href })
    }
    for (var ls = document.links, numLinks = ls.length, i = 0; i < numLinks; i++) {
        ls[i].onclick = handler(ls[i].href);
    }


})