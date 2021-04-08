//const { default: axios } = require("axios");



var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}


var data = '';
var cors = 'https://cal-cams.herokuapp.com/'
var url = ['https://cwwp2.dot.ca.gov/data/d1/cctv/cctvStatusD01.json',
    'https://cwwp2.dot.ca.gov/data/d2/cctv/cctvStatusD02.json',
    'https://cwwp2.dot.ca.gov/data/d3/cctv/cctvStatusD03.json',
    'https://cwwp2.dot.ca.gov/data/d4/cctv/cctvStatusD04.json',
    'https://cwwp2.dot.ca.gov/data/d5/cctv/cctvStatusD05.json',
    'https://cwwp2.dot.ca.gov/data/d6/cctv/cctvStatusD06.json',
    'https://cwwp2.dot.ca.gov/data/d7/cctv/cctvStatusD07.json',
    'https://cwwp2.dot.ca.gov/data/d8/cctv/cctvStatusD08.json',
    'https://cwwp2.dot.ca.gov/data/d9/cctv/cctvStatusD09.json',
    'https://cwwp2.dot.ca.gov/data/d10/cctv/cctvStatusD10.json',
    'https://cwwp2.dot.ca.gov/data/d11/cctv/cctvStatusD11.json',
    'https://cwwp2.dot.ca.gov/data/d12/cctv/cctvStatusD12.json'

];

for (var loop = 0; loop < url.length; loop++) {
    var client = new HttpClient();
    console.log(String(loop))
    client.get(cors + url[loop], function(response) {
        //console.log(response)
        //console.log(data.data.length)
        var data = JSON.parse(response).data
            //console.log(data)
            //var data = JSON.parse()
            // get the table to add rows to
        var table = document.getElementById('table');
        // cycle through the array for each of the presidents
        for (var i = 0; i < data.length; ++i) {

            var item = data[i]
                // create a row element to append cells to
            var row = document.createElement('tr');
            row.className = 'item'

            //Add Highway
            var cell = document.createElement('td')
            cell.headers = 'header101'
            cell.className = 'js-sort-string'
            cell.style = 'width:90px;'
            cell.innerHTML = data[i].cctv.location.route;
            row.appendChild(cell);

            //Add County
            var cell = document.createElement('td')
            cell.headers = 'header102'
            cell.style = 'width:135px'
            cell.innerHTML = data[i].cctv.location.county;
            row.appendChild(cell);

            //Add Nearby City
            var cell = document.createElement('td')
            cell.headers = 'header103'
            cell.style = 'width:180px'
            cell.innerHTML = data[i].cctv.location.nearbyPlace;
            row.appendChild(cell);

            //Add Image URL/URI
            var cell = document.createElement('td')
            cell.headers = 'header104'
            cell.innerHTML = "<a href='" + data[i].cctv.imageData.static.currentImageURL + '?' + data[i].cctv.imageData.static.currentImageUpdateFrequency + "'> Image </a>"
                //                           \_______________Image Url_____________________/         \__________How long till the app should refresh_________/
            row.appendChild(cell);
            table.appendChild(row);

            var row = null
        }

    });
    //w3.sortHTML('#table', '.item')

}
/*
document.addEventListener('load', () => {
    


})
*/