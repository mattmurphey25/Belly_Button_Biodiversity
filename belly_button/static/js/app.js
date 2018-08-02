function buildMetadata(sample) {
  
  // @TODO: Complete the following function that builds the metadata panel
  var meta_url = "/metadata/" + sample;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(meta_url).then(function(response) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(function([key, value]) {
      panel.append("p").text(`${key}: ${value}`);
    });
    // BONUS: Build the Gauge Chart
    buildGauge(response.WFREQ);
  });
};

function buildCharts(sample) {
  var url = "/samples/" + sample;
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(data) {
    // @TODO: Build a Bubble Chart using the sample data
    console.log(data);
    var trace1 = {
      x: data.otu_ids,
      y: data.sample_values,
      mode: "markers",
      marker: {
        color: data.otu_ids,
        colorscale: "Rainbow",
        size: data.sample_values
      },
      text: data.otu_labels,
      type: "scatter"
    };
    var data1 = [trace1];
    var layout = {
      title: "Sample Bacteria",
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Value" }
    };
    Plotly.newPlot("bubble", data1, layout);
    // @TODO: Build a Pie Chart
    id_slice = data.otu_ids.slice(0, 10);
    console.log(id_slice);
    sample_slice = data.sample_values.slice(0, 10);
    console.log(sample_slice);
    label_slice = data.otu_labels.slice(0, 10);
    console.log(label_slice);
    var trace2 = {
      labels: id_slice,
      values: sample_slice,
      hovertext: label_slice,
      type: "pie"
    };
    var data2 = [trace2];
    var layout = {
      title: "Top 10 Samples"
    };
    Plotly.newPlot("pie", data2, layout);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
};

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
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
