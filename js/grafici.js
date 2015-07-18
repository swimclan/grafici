"use strict";

var DOMReady = function(a,b,c){b=document,c='addEventListener';b[c]?b[c]('DOMContentLoaded',a):window.attachEvent('onload',a)}
    
DOMReady(function () {
	var graficiConfig = {
		tableClass: "grafici-example",
		outputID: "grafici-output",
		graphSize: {
			width: 200,
			height: 100,
			padFactor: 1.1
		},
		graphBorder: {
			color: "blue",
			width: "1px"
		}
	};

  var grafici = new Grafici(graficiConfig);
});




function Grafici(config) {

	this.config = config;

	this.targetTables = [];

	this.init = function(config) {
		this.targetTables = document.querySelectorAll('.' + config.tableClass); 

		this.buildGraphs(this.targetTables);
	};

	this.graphs = [];

	this.buildGraphs = function(targetTables) {
		var results;

		for (var i = 0; i < targetTables.length; i++) {
			var candidate = {};

			candidate.id = i;

			candidate.title = targetTables[i].getElementsByTagName('caption')[0].textContent;

			var rows = targetTables[i].getElementsByTagName('tr');

			var header = rows[0];

			//Get titles for X and Y axes
			candidate.xAxisLabel = header.cells[0].textContent;
			candidate.yAxisLabel = header.cells[1].textContent;

			candidate.xAxis = [];
			candidate.yAxis = [];

			//Get X axis data
			for (var xIndex = 1; xIndex < rows.length; xIndex++) {
				candidate.xAxis.push(rows[xIndex].cells[0].textContent);
			}

			//Get Y axis data
			for (var yIndex = 1; yIndex < rows.length; yIndex++) {
				candidate.yAxis.push(rows[yIndex].cells[1].textContent);
			}

			//Get number of rows and columns.
			//TODO: allow for a custom number of rows/columns based on
			//user specification.
			candidate.numRows = candidate.xAxis.length;
			candidate.numColumns = candidate.yAxis.length;

			candidate.max = this.getMaxOfArray(candidate.yAxis);
			candidate.min = this.getMinOfArray(candidate.yAxis);

			this.graphs.push(candidate)
		}

		console.log("Graphs:");
		console.dir(this.graphs)

		this.drawGraphs(this.graphs);
	};

	this.drawGraphs = function(graphs) {

		//Get the top and bottom of the chart with padding space added in
		var chartTop = Math.round(this.config.graphSize.height-(this.config.graphSize.height*this.config.graphSize.padFactor));
		var chartBottom = Math.round(this.config.graphSize.height * (this.config.graphSize.padFactor*this.config.graphSize.padFactor));

		for (var graphIndex in graphs) {
			var currentGraph = graphs[graphIndex];

			//Hide taret tables, leaving them visible for a screenreader
			this.targetTables[graphIndex].style.cssText = "opacity:0;position:absolute !important;clip: rect(1px 1px 1px 1px);clip: rect(1px, 1px, 1px, 1px);";

			var svg = '<figure class="grafici-graph" id="' + this.config.outputID + '-' + currentGraph.id + '"><svg viewBox = "0 ' + chartTop + ' ' + this.config.graphSize.width + ' ' + chartBottom + '" version = "1.1">'; 

			//draw baseline grid's rows and columns
			for (var i = -1; i < currentGraph.numRows + 1; i++) {
				var rowHeight = ((i+1) / (currentGraph.numRows + 1)) * this.config.graphSize.height;
				var columnLeft = ((i+1) / (currentGraph.numColumns + 1)) * this.config.graphSize.width;

				//rows
				svg += this.drawLine(0, rowHeight, this.config.graphSize.width, rowHeight, 'blue', 0.125);

				//columns
				svg += this.drawLine(columnLeft, chartTop, columnLeft, chartBottom, 'blue', 0.125);
			}

			//draw data labels
			for (var j = 0; j < currentGraph.numRows; j++) {
				var columnLeft = ((j+1) / (currentGraph.numColumns + 1)) * this.config.graphSize.width;
				var dataHeight = parseInt(this.config.graphSize.height) + (((currentGraph.yAxis[j] - currentGraph.min) / (currentGraph.max - currentGraph.min)) * -this.config.graphSize.height);

				//datalabels
				svg +=  this.drawText(columnLeft, dataHeight, 'black', 3, currentGraph.yAxis[j]);
			}

			svg += '</svg><figcaption>' + currentGraph.title + '</figcaption></figure>';

			this.targetTables[graphIndex].insertAdjacentHTML('afterend', svg);

			document.getElementById(this.config.outputID + '-' + currentGraph.id).children[0].style.cssText = "border:" + this.config.graphBorder.width + " solid " + this.config.graphBorder.color + ";";
		};
		
	};

	this.drawLine = function(x1, y1, x2, y2, strokeColor, strokeWidth) {
		var line = '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + strokeColor + '" stroke-width = "' + strokeWidth + '"/>';

		return line;
	};

	this.drawText = function(x, y, textColor, fontSize, textString) {
		var text = '<text x="' + x + '" y="' + y + '" fill="' + textColor + '" font-size="' + fontSize + '">';

		text += textString.toString() + '</text>';

		return text;
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