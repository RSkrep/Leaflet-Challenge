// Define the URL for the earthquake data
let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Fetch earthquake data using D3 and create the map
d3.json(url).then(function(earthquakeData) {
    createMap(earthquakeData);
});

// Function to create the map and add earthquake markers
function createMap(earthquakeData) {
    // Create the map object
    let map = L.map('map').setView([0, 0], 2);

    // Add the OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Function to set marker style based on earthquake magnitude and depth
    function style(feature) {
        return {
            radius: feature.properties.mag * 3,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: '#000',
            weight: 1,
            opacity: .75,
            fillOpacity: 0.8
        };
    }

    // Function to determine color based on depth
    function getColor(depth) {
        return depth > 90 ? '#FF4500' :
               depth > 70 ? '#FFA500' :
               depth > 50 ? '#FFD700' :
               depth > 30 ? '#FFFF00' :
               depth > 10 ? '#ADFF2F' :
                            '#7FFF00';
    }

    // Function to bind popups to markers
    function onEachFeature(feature, layer) {
        layer.bindPopup(
            `<h3>${feature.properties.place}</h3>
            <p>Magnitude: ${feature.properties.mag}</p>
            <p>Depth: ${feature.geometry.coordinates[2]} km</p>`
        );
    }

    // Create the GeoJSON layer with earthquake data
    L.geoJSON(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, style(feature));
        },
        onEachFeature: onEachFeature
    }).addTo(map);

    // Add a legend
let legend = L.control({ position: 'bottomright' });

legend.onAdd = function(map) {
    let div = L.DomUtil.create('div', 'info legend');
    let depths = [0, 10, 30, 50, 70, 90];
    
    div.innerHTML += '<h4>Depth (km)</h4>';

    for (let i = 0; i < depths.length; i++) {
        let depthColor = getColor(depths[i] + 1);
        div.innerHTML +=
            '<i style="background:' + depthColor + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }

    return div;
};

legend.addTo(map);
}
