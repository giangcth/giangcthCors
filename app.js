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
  var Panel = d3.select("#sample-metadata");
  
  d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata;
    var selectedSample = metadata.filter(object => object.id == sample);
    var filteredData = selectedSample[0];
    
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
          axis: { range: [null, 10], tickwidth: 1, tickcolor: "blue" },
          bar: { color: "darkblue" },
          bgcolor: "white",
          borderwidth: 2,
          bordercolor: "gray",
          steps: [
            { range: [0, 1], color: 'rgb(180, 180, 180)' },
            { range: [1, 2], color: 'rgb(160, 160, 160)' },
            { range: [2, 3], color: 'rgb(140, 140, 140)' },
            { range: [3, 4], color: 'rgb(120, 120, 120)' },
            { range: [4, 5], color: 'rgb(100, 100, 100)' },
            { range: [5, 6], color: 'rgb(80, 80, 80)' },
            { range: [6, 7], color: 'rgb(60, 60, 60)' },
            { range: [7, 8], color: 'rgb(40, 40, 40)' },
            { range: [8, 9], color: 'rgb(20, 20, 20)' },
            { range: [9, 10], color: 'rgb(00, 00, 00)' }
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
      font: { color: "grey", family: "Arial" }
    };
    
    Plotly.newPlot('gauge', gaugeTrace, gaugeLayout);

    
    // base_chart = {
    //     "values": wfreqData,
    //     "labels": ["-", "0", "20", "40", "60", "80", "100"],
    //     "domain": {"x": [0, .48]},
    //     "marker": {
    //         "colors": [
    //             'rgb(255, 255, 255)',
    //             'rgb(255, 255, 255)',
    //             'rgb(255, 255, 255)',
    //             'rgb(255, 255, 255)',
    //             'rgb(255, 255, 255)',
    //             'rgb(255, 255, 255)',
    //             'rgb(255, 255, 255)'
    //         ],
    //         "line": {
    //             "width": 1
    //         }
    //     },
    //     "name": "Gauge",
    //     "hole": .4,
    //     "type": "pie",
    //     "direction": "clockwise",
    //     "rotation": 108,
    //     "showlegend": False,
    //     "hoverinfo": "none",
    //     "textinfo": "label",
    //     "textposition": "outside"
    // }

    // meter_chart = {
    //   "values": wfreqData,
    //   "labels": ["0-1", "1-2", "2-3", "3-4", "4-5","5-6", "6-7","7-8","8-9", "9-10"],
    //   "marker": {
    //       'colors': [
    //         { range: [0, 1], color: 'rgb(180, 180, 180)' },
    //         { range: [1, 2], color: 'rgb(160, 160, 160)' },
    //         { range: [2, 3], color: 'rgb(140, 140, 140)' },
    //         { range: [3, 4], color: 'rgb(120, 120, 120)' },
    //         { range: [4, 5], color: 'rgb(100, 100, 100)' },
    //         { range: [5, 6], color: 'rgb(80, 80, 80)' },
    //         { range: [6, 7], color: 'rgb(60, 60, 60)' },
    //         { range: [7, 8], color: 'rgb(40, 40, 40)' },
    //         { range: [8, 9], color: 'rgb(20, 20, 20)' },
    //         { range: [9, 10], color: 'rgb(00, 00, 00)' }
    //       ]
    //   },
    //   "domain": {"x": [0, 0.48]},
    //   "name": "Gauge",
    //   "hole": .3,
    //   "type": "pie",
    //   "direction": "clockwise",
    //   "rotation": 90,
    //   "showlegend": False,
    //   "textinfo": "label",
    //   "textposition": "inside",
    //   "hoverinfo": "none"
    // }

    // 'shapes': [
    //   {
    //       'type': 'path',
    //       'path': 'M 0.235 0.5 L 0.24 0.62 L 0.245 0.5 Z',
    //       'fillcolor': 'rgba(44, 160, 101, 0.5)',
    //       'line': {
    //           'width': 0.5
    //       },
    //       'xref': 'paper',
    //       'yref': 'paper'
    //   }
    // ]

    // layout = {
    //   'xaxis': {
    //       'showticklabels': False,
    //       'showgrid': False,
    //       'zeroline': False,
    //   },
    //   'yaxis': {
    //       'showticklabels': False,
    //       'showgrid': False,
    //       'zeroline': False,
    //   },
    //   'shapes': [
    //       {
    //           'type': 'path',
    //           'path': 'M 0.235 0.5 L 0.24 0.65 L 0.245 0.5 Z',
    //           'fillcolor': 'rgba(44, 160, 101, 0.5)',
    //           'line': {
    //               'width': 0.5
    //           },
    //           'xref': 'paper',
    //           'yref': 'paper'
    //       }
    //   ],
    //   'annotations': [
    //       {
    //           'xref': 'paper',
    //           'yref': 'paper',
    //           'x': 0.23,
    //           'y': 0.45,
    //           'text': '50',
    //           'showarrow': False
    //       }
    //   ]
    // }

    // base_chart['marker']['line']['width'] = 0;

    // var data = [base_chart, meter_chart];

    // // fig = {"data": [base_chart, meter_chart],
    // //     "layout": layout}
    // // py.iplot(fig, filename='gauge-meter-chart')

    // Plotly.newPlot('gauge', data, layout);

  });
}


// Add event listener for submit button
d3.select("#selDataset").on("change", handleSubmit);


