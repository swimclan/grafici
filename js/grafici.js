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
        ySeries: [],
        graphType: this.getGraphType(targetTables[i])
      };
      console.log(dataSet);
      //Get X axis data
      for (var xIndex = 1; xIndex < rows.length; xIndex++) {
        dataSet.xAxis.push(rows[xIndex].cells[0].textContent);
      }

      //Get Y axis data
      for (var ySeriesIndex = 0; ySeriesIndex < dataSet.numDataSeries; ySeriesIndex++) {
        var yAxis = [];
        for (var yIndex = 1; i < rows.length; yIndex++) {
          yAxis.push(rows[yIndex].cells[ySeriesIndex + 1].textContent);
        }
        dataSet.ySeries.push(yAxis);
      }
      console.log(dataSet);
      //Get number of rows and columns.
      //TODO: allow for a custom number of rows/columns based on
      //user specification.
      dataSet.numRows = dataSet.xAxis.length;
      dataSet.numColumns = dataSet.yAxis.length;

      dataSet.max = this.getMaxOfArray(dataSet.yAxis);
      dataSet.min = this.getMinOfArray(dataSet.yAxis);

      this.graphs.push(dataSet);
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
       var figureOutput = "",
           graphOutput = "",
           pathOutput = "",
           svgOutput = "",
           pathD = "";

      figureOutput = '<figure class="grafici-graph" id="' + this.config.outputID + '-' + currentGraph.id + '">';
      svgOutput = '<svg class="grafici-graph__svg" viewBox = "0 ' + graphTop + ' ' + this.config.graphSize.width + ' ' + graphBottom + '" version = "1.1">';
      pathD;
      graphOutput;

      //Create x axis labels svg string
      var outputXAxis = '<svg class="grafici-graph__xAxis" viewBox = "0 0 ' + this.config.graphSize.width + ' ' + this.config.graphSize.xAxisHeight + '" version = "1.1">';

      if (this.config.gridLines) {
        //draw baseline grid's rows
        for (var i = graphTop; i < graphBottom / this.config.gridLines.size; i++) {
          graphOutput += this.drawLine(0, i * this.config.gridLines.size, this.config.graphSize.width, i * this.config.gridLines.size, this.config.gridLines.stroke, this.config.gridLines.strokeWidth);
        }

        //draw baseline grid's columns
        for (var m = 0; m < this.config.graphSize.width / this.config.gridLines.size; m++) {
          graphOutput += this.drawLine(m * this.config.gridLines.size, graphTop, m * this.config.gridLines.size, graphBottom, this.config.gridLines.stroke, this.config.gridLines.strokeWidth);
        }
      }

      if (currentGraph.graphType.hasOwnProperty('lineGraph')) {
        pathD = 'M' + ((currentGraph.numRows) / (currentGraph.numColumns + 1)) * this.config.graphSize.width + ' ' + ((this.config.graphSize.height) + (((currentGraph.yAxis[currentGraph.numRows-1] - currentGraph.min) / (currentGraph.max - currentGraph.min)) * -this.config.graphSize.height)) + ' L' + ((currentGraph.numRows) / (currentGraph.numColumns + 1)) * this.config.graphSize.width + ' ' + graphBottom + ' L ' + ((1) / (currentGraph.numColumns + 1)) * this.config.graphSize.width + ' ' + graphBottom;
      }

      //draw data labels and points
      for (var j = 0; j < currentGraph.numRows; j++) {
        var columnLeft = ((j+1) / (currentGraph.numColumns + 1)) * this.config.graphSize.width;
        var dataHeight = this.config.graphSize.height + (((currentGraph.yAxis[j] - currentGraph.min) / (currentGraph.max - currentGraph.min)) * -this.config.graphSize.height);
        var nextColumnLeft = ((j+2) / (currentGraph.numColumns + 1)) * this.config.graphSize.width || false;
        var nextDataHeight = parseInt(this.config.graphSize.height) + (((currentGraph.yAxis[j+1] - currentGraph.min) / (currentGraph.max - currentGraph.min)) * -this.config.graphSize.height);

        if (currentGraph.graphType.hasOwnProperty('lineGraph')) {
          //lines between datapoints
          if (j + 1 < currentGraph.numRows) {
            graphOutput += this.drawLine(columnLeft, dataHeight, nextColumnLeft, nextDataHeight, this.config.graphLines.stroke, this.config.graphLines.strokeWidth);
          }

          if (currentGraph.graphType.hasOwnProperty('lineGraph')) {
            pathD += ' L ' + columnLeft + ' ' + dataHeight;
          }

          //datapoints
          graphOutput += this.drawCircle(columnLeft, dataHeight, this.config.graphPoints.radius);
        }

        if (currentGraph.graphType.hasOwnProperty('barGraph')) {
          //datapoints
          graphOutput += this.drawLine(columnLeft, graphBottom, columnLeft, dataHeight, this.config.barGraphLines.stroke, this.config.barGraphLines.strokeWidth);
        }

        //datalabels
        graphOutput += this.drawText(columnLeft, dataHeight, 3, 1, 'start', 'black', 4, currentGraph.yAxis[j], 'grafici-data-label');

        //X axis datalabels
        outputXAxis += this.drawText(columnLeft, this.config.graphSize.xAxisHeight, 0, this.config.graphSize.xAxisHeight/-2, 'middle', 'black', 3, currentGraph.xAxis[j], 'grafici-x-label');
      }

      if (currentGraph.graphType.hasOwnProperty('lineGraph')) {
        pathD += " Z";
        var pathOutput = '<path class="grafici-data-path" d="' + pathD + '" fill="' + this.config.pathFill + '"/>';
      } else {
        var pathOutput = "";
      }

      //output Y axis datalabels
      for (var k = 0; k < (graphBottom / (this.config.gridLines.size * this.config.graphSize.yAxisLabelFrequency)); k++) {
        //Y axis datalabels
        var labelHeight = k * 3 * this.config.graphSize.yAxisLabelFrequency;

        var labelText = (((currentGraph.max - currentGraph.min) / ((-graphBottom-graphTop) / labelHeight)) + currentGraph.min) + (currentGraph.max-currentGraph.min-graphTop) + graphTop;

        labelText = Math.round(labelText * 100) / 100;

        graphOutput += this.drawText(0, labelHeight, 0.5, 1, 'start', 'black', 3, labelText, 'grafici-y-label');
      }

      outputXAxis += '</svg>';

      figureOutput += svgOutput + pathOutput + graphOutput + '</svg>' + outputXAxis + '<figcaption>' + currentGraph.title + '</figcaption></figure>';

      this.targetTables[graphIndex].insertAdjacentHTML('afterend', figureOutput);

      document.getElementById(this.config.outputID + '-' + currentGraph.id).querySelector('.grafici-graph__svg').style.cssText = "border:" + this.config.graphBorder.width + " solid " + this.config.graphBorder.color + ";";
    } // End main loop over graphs
  };

  this.drawLine = function(x1, y1, x2, y2, strokeColor, strokeWidth) {
    var line = '<line class="grafici-data-line" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + strokeColor + '" stroke-width = "' + strokeWidth + '"/>';

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
  this.getMaxOfArray = function(numArray) {
    return Math.max.apply(null, numArray);
  };

  this.getMinOfArray = function(numArray) {
    return Math.min.apply(null, numArray);
  };

  this.init(this.config);
}
