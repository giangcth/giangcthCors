function scrollBar() {
    var sampleID = d3.select("#selDataset");
  
    d3.json("data/samples.json").then((data) => {
      console.log(data);

      var sampleNames = data.names;
      sampleNames.forEach((sample)=> {
        sampleID
          .append("option")
          .text(sample)
          .property("value", sample);
        });
      })};
  
scrollBar();

// Submit Button handler
function handleSubmit() {
  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input value from the form
  var sample = d3.select("#selDataset").node().value;
  console.log(sample);

  // // clear the input value
  // d3.select("#selDataset").node().value = "";

  // Build the Demographic Info Table with the new sample

  Metadata(sample);
  barChart(sample);
  bubbleChart(sample);
  gaugeChart(sample);

  };


function Metadata(sample) {
  d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata;
    var selectedSample = metadata.filter(object => object.id == sample);
    var filteredData = selectedSample[0];
    var Panel = d3.select("#sample-metadata");

    Panel.html("");
    
    Object.entries(filteredData).forEach(([key, value]) => {
      Panel.append("h6").text(key.toUpperCase() + ': ' + value); 
    })

  });
}
  

function barChart(sample) {
  d3.json("data/samples.json").then((Data) => {
    var sampleData = Data.samples;
    var selectedSampleID = sampleData.filter(object => object.id == sample);
    var filteredData = selectedSampleID[0];
    console.log(filteredData);  

    var topTenOtuIds = filteredData.otu_ids.slice(0, 10).map( otuID => {
      return 'OTU ' + otuID + '  ';
    }).reverse();
    
    var topTenSampleValue = filteredData.sample_values.slice(0, 10).reverse();
    var topTenOtuLabel = filteredData.otu_labels.slice(0, 10).reverse();
    
    var barTrace = [
      {
        x: topTenSampleValue,  
        y: topTenOtuIds,
        text: topTenOtuLabel,
        name: "Sample Value",
        type: 'bar',
        orientation: 'h'
      }
      ];

    var barLayout = {
        title: "Top 10 OTUs by Sample Values",
        margin: {
          l: 100,
          r: 100,
          t: 100,
          b: 100
        },
        xaxis : {title: "Sample Value"}, 

      };
      
    Plotly.newPlot('bar', barTrace, barLayout)

  });
}
  
function bubbleChart(sample) {
  d3.json("data/samples.json").then((Data) => {
    var sampleData = Data.samples;
    var selectedSampleID = sampleData.filter(object => object.id == sample);
    var filteredData = selectedSampleID[0];
    console.log(filteredData);  

    var OtuIds = filteredData.otu_ids.reverse();
    
    var SampleValue = filteredData.sample_values.reverse();
    var OtuLabel = filteredData.otu_labels.reverse();
    
    var bubbleTrace = [
      {
        x: OtuIds,  
        y: SampleValue,
        text: OtuLabel,
        mode: 'markers',
        marker: {
        color: OtuIds,
        size: SampleValue
        }
      }
    ];
   

    var bubbleLayout = {
        title: "Market Size and Color for each sample ID by sample value",
        showlegend: false,
        xaxis : {title: "OTU ID"}, 

    };
      
    Plotly.newPlot('bubble', bubbleTrace, bubbleLayout)

  });
}


function gaugeChart(sample) {
  d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata;
    var selectedSample = metadata.filter(object => object.id == sample);
    var filteredData = selectedSample[0];
    console.log(filteredData);  

    var wfreqData = filteredData.wfreq;
    console.log(wfreqData);

    var gaugeTrace = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        type: "indicator",
        mode: "gauge+number",
        value: wfreqData,
        title: { text: "Belly Button Washing Frequency <br> Scrubs Per Week", font: { size: 18 } },
        gauge: {
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "darkblue" },
          bar: { color: "darkblue" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 1], color: 'rgb(180, 180, 180)' },
            { range: [1, 2], color: 'rgb(180, 180, 180)' },
            { range: [2, 3], color: 'rgb(140, 140, 140)' },
            { range: [3, 4], color: 'rgb(140, 140, 140)' },
            { range: [4, 5], color: 'rgb(100, 100, 100)' },
            { range: [5, 6], color: 'rgb(100, 100, 100)' },
            { range: [6, 7], color: 'rgb(60, 60, 60)' },
            { range: [7, 8], color: 'rgb(60, 60, 60)' },
            { range: [8, 9], color: 'rgb(30, 30, 30)' },
            { range: [9, 10], color: 'rgb(30, 30, 30)' }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 9
          }
        }
      }
    ];
    
    var gaugeLayout = {
      width: 300,
      height: 500,
      margin: { t: 0, r: 0, l: 0, b: 0 },
      paper_bgcolor: "white",
      font: { color: "black", family: "Arial" }
    };
    
    Plotly.newPlot('gauge', gaugeTrace, gaugeLayout);

  });
}


// Add event listener for submit button
d3.select("#selDataset").on("change", handleSubmit);