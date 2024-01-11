let streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

let map = L.map("map", {
    center: [44.58, -95.46],
    zoom: 4.4
});
  
streetmap.addTo(map);

colorLib = {
   green: "#81FF56",
   lime_green: "#C5FF4F",
   yellow: "#F5FF51",
   orange: "#FFBF2B",
   blood_orange: "#FF6F25",
   red: "#FF1A0B" 
}
var legend = L.control({position: 'bottomright'});

legend.onAdd = function () {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [-10, 10, 30, 50, 70, 90],
        labels = ["green", "lime_green", "yellow", "orange", "blood_orange", "red"];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorLib[labels[i]] + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(rawData) {

    summary = rawData.features

    for (let i = 0; i < summary.length; i++){

        earthquake = summary[i].geometry.coordinates
        magnitude = summary[i].properties.mag
        place = summary[i].properties.place
        code = summary[i].properties.code
        title = summary[i].properties.title
        gap = summary[i].properties.gap
        RMS = summary[i].properties.rms
        NST = summary[i].properties.nst
        
        //console.log(earthquake);

        if (earthquake[2] < 10){
            myColor = colorLib["green"]
        }else if (earthquake[2] < 30){
            myColor = colorLib["lime_green"]
        }else if (earthquake[2] < 50){
            myColor = colorLib["yellow"]
        }else if (earthquake[2] < 70){
            myColor = colorLib["orange"]
        }else if (earthquake[2] < 90){
            myColor = colorLib["blood_orange"]
        }else (myColor = colorLib["red"])

        let quakes = L.circleMarker([earthquake[1], earthquake[0]], {
            weight: .7,
            fillColor: myColor,
            fillOpacity: 1,
            radius: magnitude * 3,
            color: "black"

        });

        quakes.bindPopup("Place: " + place + 
        "<br>Magnitude: " + magnitude + 
        "<br>Depth: " + earthquake[2] +
        "<br>Code: " + code + 
        "<br>Gap: " + gap + 
        "<br>RSM: " + RMS +
        "<br>NST: " + NST
        )

        quakes.addTo(map);
    
    };

});