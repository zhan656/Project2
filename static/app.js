function reloadMeta(Data){
     var met = document.getElementById("sample_metadata");
    // Clear pre_existed metadata
    met.innerHTML = '';
    // Loop through all of the keys in the json response and
    // create new metadata tags
    for(var key in Data) {
        tag = document.createElement("h5");
        Content = document.createTextNode(`${key}: ${Data[key]}`);
        tag.append(Content);
        met.appendChild(tag);
    }
}

function buildCharts(sampleData) {
    // Loop through sample data and find the OTU Taxonomic Name
    var points = sampleData['points'];
    var prices = sampleData['prices'];
    var countries = sampleData['countries'];
    var uniq_countries = [...new Set(countries)];
    var ct_countries = []; // count the occurence of each country
    uniq_countries.forEach(function(x){return ct_countries.push(countries.filter(function(y){return y==x}).length)});
    console.log(ct_countries);
    var color_int = []; // to build a color reference number for each row based on country name
    var color_ref = {}; // dictionary for color reference of each country
    var i = 6;
    uniq_countries.forEach(function(x){color_ref[x]=i; i = i + 40;});
    countries.forEach(function(x){color_int.push(color_ref[x])});
    console.log(color_int);
    // var OtuIDs = otuIDs.map(String)
    // Build Bubble Chart
    var bubbleLayout = {
        margin: { t: 35 },
        height: 800,
        width: 1200,
        hovermode: 'closest',
        xaxis: { title: 'Countries' },
        yaxis: { title: 'Price'},
        title: 'Price vs. Points Based on "Variety"',
        showlegend: false,
        plot_bgcolor: '#d9d9d9',
    };
    var bubbleData = [{
        x: countries,
        y: prices,
        text: points,
        mode: 'markers',
        marker: {
            size: points.map(function(x){return (x-78)*2}),
            color: color_int,
            colorscale: "Earth",
            opacity: 0.4,
        }
    }];
    var BUBBLE = document.getElementById('Bubble');
    Plotly.plot(BUBBLE, bubbleData, bubbleLayout);
    // Build Pie Chart
    // console.log(sampleData['sample_values'].slice(0, 10))
    var pieData = [{
        values: ct_countries,
        labels: uniq_countries,
        // hovertext: [labels.slice(0, 10)],
        // hoverinfo: 'hovertext',
        type: 'pie'
    }];
    var pieLayout = {
        margin: { t: 5, l: 2 }
    };
    var PIE = document.getElementById('Pie');
    Plotly.plot(PIE, pieData, pieLayout);
};
function updateCharts(sampleData) {
    // Loop through sample data and find the OTU Taxonomic Name
    var points = sampleData['points'];
    var prices = sampleData['prices'];
    var countries = sampleData['countries'];
    var uniq_countries = [...new Set(countries)];
    console.log(uniq_countries);
    var ct_countries = [];
    uniq_countries.forEach(function(x){return ct_countries.push(countries.filter(function(y){return y==x}).length)});
    console.log(ct_countries);
    var color_int = []; // to build a color reference number for each row based on country name
    var color_ref = {}; // dictionary for color reference of each country
    var i = 6;
    uniq_countries.forEach(function(x){color_ref[x]=i; i = i + 40;});
    countries.forEach(function(x){color_int.push(color_ref[x])});
    console.log(color_int);
    // var OtuIDs = otuIDs.map(String)
    // Update the Bubble Chart with the new data
    var BUBBLE = document.getElementById('Bubble');
    Plotly.restyle(BUBBLE, 'x', [countries]);
    Plotly.restyle(BUBBLE, 'y', [prices]);
    Plotly.restyle(BUBBLE, 'text', [points]);
    Plotly.restyle(BUBBLE, 'marker.size', [points.map(function(x){return (x-78)*2})]);
    Plotly.restyle(BUBBLE, 'marker.color', [color_int]);
    // Update the Pie Chart with the new data
    // Use slice to select only the top 10 OTUs for the pie chart
    var PIE = document.getElementById('Pie');
    var pieUpdate = {
        values: [ct_countries],
        labels: [uniq_countries],
        // hovertext: [labels.slice(0, 10)],
        // hoverinfo: 'hovertext',
        type: 'pie'
    };
    Plotly.restyle(PIE, pieUpdate);
}

function getData(variety, callback) {
    // Use a request to grab the json data needed for all charts
    Plotly.d3.json(`/price_points/${variety}`, function(error, sampleData) {
        if (error) return console.warn(error);
        callback(sampleData);
    });
    Plotly.d3.json(`/metadata/${variety}`, function(error, metaData) {
        if (error) return console.warn(error);
        reloadMeta(metaData);
    })
    // BONUS - Build the Gauge Chart
    // buildGauge(sample);
}

function getOptions() {
    // Grab a reference to the dropdown select element
    var selDataset = document.getElementById('selDataset');
    // Use the list of sample names to populate the select options
    Plotly.d3.json('/names', function(error, sampleNames) {
        for (var i = 0; i < sampleNames.length;  i++) {
            var currentOption = document.createElement('option');
            currentOption.text = sampleNames[i];
            currentOption.value = sampleNames[i]
            selDataset.appendChild(currentOption);
        }
        getData(sampleNames[0],buildCharts);
    })
}
function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    getData(newSample, updateCharts);
}
function init() {
    getOptions();
}
// Initialize the dashboard
init();