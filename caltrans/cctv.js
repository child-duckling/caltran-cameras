var myTimer = setInterval(function() { loadCCTVImages() }, 60000);
var today = Date.now();

function loadCCTVImages() {
    var selectedDistrict = document.getElementById('district');
    var url = selectedDistrict.options[selectedDistrict.selectedIndex].value + "?" + today;

    $.getJSON(
        url,
        function(json) {
            //sort based on route and milepost
            var jsonData = json.data.sort(
                function(a, b) {
                    if (a.cctv.location.route.match(/\d+/) - b.cctv.location.route.match(/\d+/) > 0) return 1;
                    if (a.cctv.location.route.match(/\d+/) - b.cctv.location.route.match(/\d+/) < 0) return -1;
                    if (a.cctv.location.milepost - b.cctv.location.milepost > 0) return 1;
                    if (a.cctv.location.milepost - b.cctv.location.milepost < 0) return -1;
                    return 0;
                }
            )

            var output = "";
            var columnCounter = 0;
            var rowCounter = 0;
            var route = "";

            var columnPosition = 0;
            var imageRowPosition = 0;
            var descriptionRowPosition = 323;
            var firstTimeThroughFlag = 0;

            //find the sign data in the $xml file
            for (i in jsonData) {
                var record = jsonData[i];

                if (record.cctv.imageData.static.currentImageURL == "Not Reported") continue;

                record.cctv.location.route = (record.cctv.location.route == "") ? "Unknown Route" : record.cctv.location.route;
                if (route != record.cctv.location.route) {

                    if (firstTimeThroughFlag == 1) {
                        if (columnCounter == 0) {
                            imageRowPosition += 0;
                            descriptionRowPosition += 83;
                        } else {
                            imageRowPosition += 280;
                            descriptionRowPosition += 363;
                        }
                    }

                    columnCounter = 0;
                    columnPosition = 107;

                    output += "<div style=\"position:absolute;left:" + columnPosition + "px;top:" + imageRowPosition + "px;width:1060px;background-color:grey;color:black;\"><h1>" + record.cctv.location.route + "</h1></div>\n";
                    route = record.cctv.location.route;

                    imageRowPosition += 83;
                }

                var currentImageURL;
                if (selectedDistrict.options[selectedDistrict.selectedIndex].label == "South Dakota") {
                    currentImageURL = cctv.imageData.static.currentImageURL;
                } else {
                    var today = new Date();
                    currentImageURL = record.cctv.imageData.static.currentImageURL.indexOf('?') === -1 ? record.cctv.imageData.static.currentImageURL + "?" + today.getTime() : record.cctv.imageData.static.currentImageURL + "&" + today.getTime();
                }

                if (selectedDistrict.options[selectedDistrict.selectedIndex].label.includes("District")) {
                    currentImageURL = currentImageURL.replace("http://cwwp2.dot.ca.gov", "https://cwwp2-ssl.dot.ca.gov");
                }

                var locationName = (record.cctv.location.locationName == "") ? "&nbsp" : record.cctv.location.locationName;
                var routeMilepost = (record.cctv.location.route == "" || record.cctv.location.milepost == "") ? "&nbsp" : record.cctv.location.route + " Milepost " + record.cctv.location.milepost;
                columnPosition = 102 + (5 + columnCounter * 354);

                output += "<div style=\"position:absolute;left:" + columnPosition + "px;top:" + imageRowPosition + "px;width:352px;\"><img border=\"0\" src=\"" + currentImageURL + "\" alt=\"" + locationName + "\" title=\"" + locationName + "\" width=\"352\" height=\"240\"></div>\n";
                output += "<div style=\"position:absolute;left:" + columnPosition + "px;top:" + descriptionRowPosition + "px;width:352px;background-color:black;color:white;\">" + locationName + "<br>" + routeMilepost + "</div>\n";

                if (columnCounter < 2) {
                    columnCounter++;
                } else {
                    columnCounter = 0;
                    rowCounter++;
                    imageRowPosition += 280;
                    descriptionRowPosition += 280;
                }

                firstTimeThroughFlag = 1;
            }
            document.getElementById("test").innerHTML = output;
        }
    );
}