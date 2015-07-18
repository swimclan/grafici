"use strict";

var DOMReady = function(a,b,c){b=document,c='addEventListener';b[c]?b[c]('DOMContentLoaded',a):window.attachEvent('onload',a)}
    
DOMReady(function () {
	var graficiConfig = {
		tableClass: ".grafici-example"
	};

  var grafici = new Grafici(graficiConfig);
});




function Grafici(config) {

	this.config = config;

	this.targetTables = [];

	this.init = function(config) {
		this.targetTables = document.querySelectorAll(config.tableClass); 

		this.buildGraphs(this.targetTables);
	};

	this.graphs = [];

	this.buildGraphs = function(targetTables) {
		var results;

		for (var i = 0; i < targetTables.length; i++) {
			var candidate = {};

			candidate.id = i;

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

			this.graphs.push(candidate)
		}

		console.dir(this.graphs)

		this.drawGraphs();
	};

	this.drawGraphs = function(graphs) {
		var svg = '<svg viewBox = "0 0 200 200" version = "1.1">'; 

		svg += this.drawLine(0, 0, 200, 200, 'pink', 7);

		svg += '</svg>';

		document.documentElement.innerHTML = document.documentElement.innerHTML += svg;
	};

	this.drawLine = function(x1, y1, x2, y2, strokeColor, strokeWidth) {
		var line = '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 +'" stroke="' + strokeColor + '" stroke-width = "' + strokeWidth + '"/>';

		return line;
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