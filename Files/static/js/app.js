function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var url="/metadata/"+sample;
  console.log(url);
  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(url).then(function(data){
      console.log(data);
      var metadata_Sample = d3.select("#sample-metadata");
    
      // Use `.html("") to clear any existing metadata
      metadata_Sample.selectAll("p").remove();
      
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      for(var key in data){
        if(data.hasOwnProperty(key)){
          metadata_Sample.append("p").text(key+": " +data[key]);
        }
      }
      // BONUS: Build the Gauge Chart
      buildGauge(data.WFREQ);
    });
}

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).


function buildCharts(sample) {
  d3.json(`/samples/${sample}`).then((data) => {
    const ids = data.otu_ids;
    const labels = data.otu_labels;
    const values = data.sample_values;
 
    // Build a Bubble Chart
    var bubbleLayout = {
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" }
    };
    var bubbleData = [
      {
        x: ids,
        y: values,
        text: labels,
        mode: "markers",
        marker: {
          size: values,
          color: ids,
          colorscale: "Electric"
        }
      }
    ];
 
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
 
    // Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var pieData = [
      {
        values: values.slice(0, 10),
        labels: ids.slice(0, 10),
        hovertext: labels.slice(0, 10),
        hoverinfo: "hovertext",
        type: "pie"
      }
    ];
 
    var pieLayout = {
      margin: { t: 0, l: 0 },
      colorway : ['#f3cec9', '#e7a4b6', '#cd7eaf', '#a262a9', '#6f4d96', '#3d3b72', '#182844']
    };
 
    Plotly.newPlot("pie", pieData, pieLayout);
  });
 }

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector 
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  console.log('in option changed')
  console.log(newSample)
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
