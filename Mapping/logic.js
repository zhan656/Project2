
// Create a map object
var myMap = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5
});

// Add a tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoicG9pc3NvbnEiLCJhIjoiY2poeG50YmV3MGM0aTNrdWxuZ3FuYXN4NyJ9.KhR7WRWA64C7e8jFg3ZOpw." +
  "T6YbdDixkOBWH_k9GbS8JQ"
).addTo(myMap);

var data = d3.json("https://raw.githubusercontent.com/brittney-joyce/Visualization_Project2/master/Data/location_data.json", function(data){
    console.log(data);
    for (var i = 0; i < data.length; i++) {
  var country = data[i];
  L.marker(country.location)
    .bindPopup("<h1>" + country.winery + "</h1><br> <h1>" + country.region_1 + "</h1><br> <hr> <h3>Winery " + country.country + "</h3>")
    .addTo(myMap);
    }
});
