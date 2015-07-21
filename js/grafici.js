"use strict";

function Grafici(config) {
  this.config = config;
  this.targetTables = [];
  this.graphs = [];

  this.init = function(config) {
    this.targetTables = document.querySelectorAll('.' + config.tableClass);

    this.buildGraphs(this.targetTables);
  };

  this.buildGraphs = function(targetTables) {
    var results;

    for (var i = 0; i < targetTables.length; i++) {
      var rows = targetTables[i].getElementsByTagName('tr');
      var header = rows[0];

      var dataSet = {
        id: i,
        title: (function() {
          if ( targetTables[i].getElementsByTagName('caption').length ) {
            return targetTables[i].getElementsByTagName('caption')[0].textContent;
          } else {
            console.error('Table has no caption, falling back to generic name: ');
            console.dir(targetTables[i]);
            return "unnamed table";
          }
        })(),
        numDataSeries: rows[0].children.length - 1,
        xAxisLabel: header.cells[0].textContent,
        yAxisLabel: header.cells[1].textContent,
        xAxis: [],
        //This is an array of y-axis series to support multiple graphs on a single coordinate plane
        ySeries: [],
        graphType: this.getGraphType(targetTables[i])
      };

      //Get X axis data
      for (var xIndex = 1; xIndex < rows.length; xIndex++) {
        dataSet.xAxis.push(rows[xIndex].cells[0].textContent);
      }

      //Get Y axis data
      for (var ySeriesIndex = 0; ySeriesIndex < dataSet.numDataSeries; ySeriesIndex++) {
        var yAxis = [];
        for (var yIndex = 1; yIndex < rows.length; yIndex++) {
          yAxis.push(rows[yIndex].cells[ySeriesIndex + 1].textContent);
        }
        dataSet.ySeries.push(yAxis);
      }

      //Get number of rows and columns.
      //TODO: allow for a custom number of rows/columns based on
      //user specification.
      dataSet.numRows = dataSet.xAxis.length;
      dataSet.numColumns = dataSet.ySeries[0].length;

      // Need to be able to find the max among all the series of y data
      dataSet.max = this.getMaxAmongArrays(dataSet.ySeries);
      dataSet.min = this.getMinAmongArrays(dataSet.ySeries);

      this.graphs.push(dataSet);
      console.log(dataSet)
    }

    this.drawGraphs(this.graphs);
  };

  this.getGraphType = function(graphElem) {
    var classNames = graphElem.getAttribute('class');
    var graphType = {};

    if (classNames.indexOf('grafici-bar-graph') != -1) {
      graphType.barGraph = true;
    }

    if (classNames.indexOf('grafici-line-graph') != -1) {
      graphType.lineGraph = true;
    }

    if (graphType == {}) {
      graphType.lineGraph = true;
    }

    return graphType;
  };

  this.drawGraphs = function(graphs) {
    for (var graphIndex in graphs) {
      var currentGraph = graphs[graphIndex];

      //Fit graph within alotted space. Pads top and bottom by 5%.
      var paddingFactor = (((currentGraph.numRows + 1) / currentGraph.numRows) + 1) / 2;
      paddingFactor = ((paddingFactor - 1) / 2) + 1;

      //Get the top and bottom of the chart with padding space added in
      var graphTop = Math.floor(this.config.graphSize.height-(this.config.graphSize.height*paddingFactor));
      var graphBottom = Math.floor(this.config.graphSize.height * (paddingFactor * paddingFactor));

      //Hide taret tables, leaving them visible for a screenreader
      this.targetTables[graphIndex].style.cssText = "opacity:0;position:absolute !important;clip: rect(1px 1px 1px 1px);clip: rect(1px, 1px, 1px, 1px);";

      //Create primary graph svg strings
       var figureOutput = '<figure class="grafici-graph" id="' + this.config.outputID + '-' + currentGraph.id + '">',
           //need a background grid seperate from the data line graph output to support multiple y data series
           gridOutput = "",
           //multiple graph outputs for each y data series
           graphOutput = [],
           //multiple path outputs for each y data series
           pathOutput = [],
           svgOutput = "",
           //build multiple paths for each y series
           pathD = [];
      //need an SVG for each series... I think....
      svgOutput = [];
      gridOutput;
      pathD;
      graphOutput;

      //Create x axis labels svg string
      var outputXAxis = '<svg class="grafici-graph__xAxis" viewBox = "0 0 ' + this.config.graphSize.width + ' ' + this.config.graphSize.xAxisHeight + '" version = "1.1">';

      if (this.config.gridLines) {
        //draw baseline grid's rows
        for (var i = graphTop; i < graphBottom / this.config.gridLines.size; i++) {
          gridOutput += this.drawLine(0, i * this.config.gridLines.size, this.config.graphSize.width, i * this.config.gridLines.size, this.config.gridLines.stroke, this.config.gridLines.strokeWidth);
        }

        //draw baseline grid's columns
        for (var m = 0; m < this.config.graphSize.width / this.config.gridLines.size; m++) {
          gridOutput += this.drawLine(m * this.config.gridLines.size, graphTop, m * this.config.gridLines.size, graphBottom, this.config.gridLines.stroke, this.config.gridLines.strokeWidth);
        }
      }

      if (currentGraph.graphType.hasOwnProperty('lineGraph')) {
        for (var pathDIndex=0; pathDIndex<currentGraph.ySeries.length; pathDIndex++) {
          //mutate pathD with a path for each y series
          pathD[pathDIndex] = 'M ' + ((currentGraph.numRows) / (currentGraph.numColumns + 1)) * this.config.graphSize.width + ' ' + ((this.config.graphSize.height) + (((currentGraph.ySeries[pathDIndex][currentGraph.numRows-1] - currentGraph.min) / (currentGraph.max - currentGraph.min)) * -this.config.graphSize.height)) + ' L ' + ((currentGraph.numRows) / (currentGraph.numColumns + 1)) * this.config.graphSize.width + ' ' + graphBottom + ' L ' + ((1) / (currentGraph.numColumns + 1)) * this.config.graphSize.width + ' ' + graphBottom;
        }
      }

      //draw data labels and points
      for (var j = 0; j < currentGraph.numRows; j++) {
        var columnLeft = ((j+1) / (currentGraph.numColumns + 1)) * this.config.graphSize.width;
        //again, need  multiple data heights for each x value to support multiple y series
        var dataHeight = [];
        for (var dataHeightIndex = 0; dataHeightIndex < currentGraph.ySeries.length; dataHeightIndex++) {
          dataHeight.push(this.config.graphSize.height + (((currentGraph.ySeries[dataHeightIndex][j] - currentGraph.min) / (currentGraph.max - currentGraph.min)) * -this.config.graphSize.height));
        }
        var nextColumnLeft = ((j+2) / (currentGraph.numColumns + 1)) * this.config.graphSize.width || false;
        //multiple next data heights for multiple y data series
        var nextDataHeight = [];
        for (var nextDataHeightIndex = 0; nextDataHeightIndex < currentGraph.ySeries.length; nextDataHeightIndex++) {
          nextDataHeight.push(parseInt(this.config.graphSize.height) + (((currentGraph.ySeries[nextDataHeightIndex][j+1] - currentGraph.min) / (currentGraph.max - currentGraph.min)) * -this.config.graphSize.height));
        }
        if (currentGraph.graphType.hasOwnProperty('lineGraph')) {
          //lines between datapoints
          if (j + 1 < currentGraph.numRows) {
            // populate the graphOutput array with multiple strings for each y data series
            for (var seriesIndex=0; seriesIndex < currentGraph.ySeries.length; seriesIndex++) {
              //check to see if the array is blank (meaning no string in it yet)
              if (graphOutput[seriesIndex] === undefined) {
                graphOutput[seriesIndex] = "";
              }
              graphOutput[seriesIndex] += this.drawLine(columnLeft, dataHeight[seriesIndex], nextColumnLeft, nextDataHeight[seriesIndex], this.config.graphLines.stroke, this.config.graphLines.strokeWidth);
            }
          }

          if (currentGraph.graphType.hasOwnProperty('lineGraph')) {
            //append to the pathD array for each y data series
            for (var pathDIndex=0; pathDIndex<currentGraph.ySeries.length; pathDIndex++) {
              pathD[pathDIndex] += ' L ' + columnLeft + ' ' + dataHeight[pathDIndex];
            }
          }

          //datapoints
          //add to each graphOutput value in the graphOutput array for each y data series
          for (var graphDataIndex=0; graphDataIndex<currentGraph.ySeries.length; graphDataIndex++) {
            if (graphOutput[graphDataIndex] === undefined) {
              graphOutput[graphDataIndex] = "";
            }
            graphOutput[graphDataIndex] += this.drawCircle(columnLeft, dataHeight[graphDataIndex], this.config.graphPoints.radius);
          }
        }

        if (currentGraph.graphType.hasOwnProperty('barGraph')) {
          //datapoints
          // add to each graphOutput value in the graphOutput array
          for (var graphDataIndex=0; graphDataIndex<currentGraph.ySeries.length; graphDataIndex++) {
            //check to see if the graphOutput is empty
            if (graphOutput[graphDataIndex] === undefined) {
              graphOutput[graphDataIndex] = "";
            }
            graphOutput[graphDataIndex] += this.drawLine(columnLeft, graphBottom, columnLeft, dataHeight[graphDataIndex], this.config.barGraphLines.stroke, this.config.barGraphLines.strokeWidth);
          }
        }

        //datalabels
        //add data labels for each y data series
        for (var graphDataIndex=0; graphDataIndex<currentGraph.ySeries.length; graphDataIndex++) {
          // check to make sure the graphOutput is not empty
          if (graphOutput[graphDataIndex] === undefined) {
            graphOutput[graphDataIndex] = "";
          }
          graphOutput[graphDataIndex] += this.drawText(columnLeft, dataHeight[graphDataIndex], 3, 1, 'start', 'black', 4, currentGraph.ySeries[graphDataIndex][j], 'grafici-data-label');
        }
        //X axis datalabels
        outputXAxis += this.drawText(columnLeft, this.config.graphSize.xAxisHeight, 0, this.config.graphSize.xAxisHeight/-2, 'middle', 'black', 3, currentGraph.xAxis[j], 'grafici-x-label');
      }

      // add to the pathOutput array for multiple y data series
      for (var pathDataIndex=0; pathDataIndex<currentGraph.ySeries.length; pathDataIndex++) {
        if (currentGraph.graphType.hasOwnProperty('lineGraph')) {
            pathD[pathDataIndex] += " Z";
            pathOutput[pathDataIndex] = '<path class="grafici-data-path" d="' + pathD[pathDataIndex] + '" fill="' + this.config.pathFill + '"/>';
        } else {
          pathOutput[pathDataIndex] = "";
        }
      }

      //output Y axis datalabels
      for (var k = 0; k < (graphBottom / (this.config.gridLines.size * this.config.graphSize.yAxisLabelFrequency)); k++) {
        //Y axis datalabels
        var labelHeight = k * 3 * this.config.graphSize.yAxisLabelFrequency;

        var labelText = (((currentGraph.max - currentGraph.min) / ((-graphBottom-graphTop) / labelHeight)) + currentGraph.min) + (currentGraph.max-currentGraph.min-graphTop) + graphTop;

        labelText = Math.round(labelText * 100) / 100;
        // write multiple label sets for each y data series
        for (var graphDataIndex=0; graphDataIndex<currentGraph.ySeries.length; graphDataIndex++) {
          if (graphOutput[graphDataIndex] === undefined) {
            graphOutput[graphDataIndex] = "";
          }
          graphOutput[graphDataIndex] += this.drawText(0, labelHeight, 0.5, 1, 'start', 'black', 3, labelText, 'grafici-y-label');
        }
      }

      outputXAxis += '</svg>';
      //initialize figure output

      figureOutput += ('<svg class="grafici-graph__svg" viewBox = "0 ' + graphTop + ' ' + this.config.graphSize.width + ' ' + graphBottom + '" version = "1.1">' + gridOutput);
      //append to figure output each path and graph output with multiple y data series
      for (var seriesDataIndex=0; seriesDataIndex<currentGraph.ySeries.length; seriesDataIndex++) {
        console.log(pathOutput[seriesDataIndex]);

        figureOutput += (pathOutput[seriesDataIndex] + graphOutput[seriesDataIndex]);

      }
      figureOutput += ('</svg>');
      figureOutput += (outputXAxis + '<figcaption>' + currentGraph.title + '</figcaption></figure>');

      this.targetTables[graphIndex].insertAdjacentHTML('afterend', figureOutput);

      document.getElementById(this.config.outputID + '-' + currentGraph.id).querySelector('.grafici-graph__svg').style.cssText = "border:" + this.config.graphBorder.width + " solid " + this.config.graphBorder.color + ";";
    } // End main loop over graphs
  };

  this.drawLine = function(x1, y1, x2, y2, strokeColor, strokeWidth) {
    var line = '<line class="grafici-data-line" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + strokeColor + '" stroke-width = "' + strokeWidth + '"></line>';

    return line;
  };

  this.drawText = function(x, y, dx, dy, textAnchor, textColor, fontSize, textString, className) {
    var text = '<text class="grafici-data-text ' + className + '" x="' + x + '" y="' + y + '" dx="' + dx + '" dy="' + dy + '" text-anchor="' + textAnchor + '" fill="' + textColor + '" font-size="' + fontSize + '">';

    text += textString.toString() + '</text>';

    return text;
  };

  this.drawCircle = function(cx, cy, r) {
    var circle = '<circle class="grafici-data-point" cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + this.config.graphPoints.color + '" stroke="' + this.config.graphPoints.stroke + '" stroke-width="' + this.config.graphPoints.strokeWidth + '" />';

    return circle;
  };

  //Utility functions
  this.getMaxAmongArrays = function(seriesArray) {
    var masterArray = [];
    seriesArray.forEach(function(memberArray) {
      memberArray.forEach(function(num) {
        masterArray.push(num);
      });
    });
    return Math.max.apply(null, masterArray);
  };

  this.getMinAmongArrays = function(seriesArray) {
    var masterArray = [];
    seriesArray.forEach(function(memberArray) {
      memberArray.forEach(function(num) {
        masterArray.push(num);
      });
    });
    return Math.min.apply(null, masterArray);
  };

  this.init(this.config);
}
