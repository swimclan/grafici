"use strict";

var DOMReady = function(a,b,c){b=document,c='addEventListener';b[c]?b[c]('DOMContentLoaded',a):window.attachEvent('onload',a)}
    
DOMReady(function () {
	var graficiConfig = {
		tableClass: "grafici-example",
		outputID: "grafici-output",
		graphSize: {
			width: 200,
			height: 100
		},
		graphBorder: {
			color: "#444",
			width: "0.075em"
		},
		gridLines: {
			size: 3,
			stroke: "rgb(20,100,200)",
			strokeWidth: "0.0625"
		},
		graphPoints: {
			color: "rgb(20,180,250)",
			stroke: "transparent",
			strokeWidth: 8,
			radius: 1
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
			var rows = targetTables[i].getElementsByTagName('tr');
			var header = rows[0];

			var dataSet = {
				id: i,
				title: targetTables[i].getElementsByTagName('caption')[0].textContent,
				xAxisLabel: header.cells[0].textContent,
				yAxisLabel: header.cells[1].textContent,
				xAxis: [],
				yAxis: []
			};
			
			//Get X axis data
			for (var xIndex = 1; xIndex < rows.length; xIndex++) {
				dataSet.xAxis.push(rows[xIndex].cells[0].textContent);
			}

			//Get Y axis data
			for (var yIndex = 1; yIndex < rows.length; yIndex++) {
				dataSet.yAxis.push(rows[yIndex].cells[1].textContent);
			}

			//Get number of rows and columns.
			//TODO: allow for a custom number of rows/columns based on
			//user specification.
			dataSet.numRows = dataSet.xAxis.length;
			dataSet.numColumns = dataSet.yAxis.length;

			dataSet.max = this.getMaxOfArray(dataSet.yAxis);
			dataSet.min = this.getMinOfArray(dataSet.yAxis);

			this.graphs.push(dataSet)
		}

		this.drawGraphs(this.graphs);
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

			var output = '<figure class="grafici-graph" id="' + this.config.outputID + '-' + currentGraph.id + '">';
			output += '<svg viewBox = "0 ' + graphTop + ' ' + this.config.graphSize.width + ' ' + graphBottom + '" version = "1.1">'; 

			if (this.config.gridLines) {
				//draw baseline grid's rows
				for (var i = graphTop; i < graphBottom / this.config.gridLines.size; i++) {
					output += this.drawLine(0, i * this.config.gridLines.size, this.config.graphSize.width, i * this.config.gridLines.size, this.config.gridLines.stroke, this.config.gridLines.strokeWidth);
				}

				//draw baseline grid's columns
				for (var i = 0; i < this.config.graphSize.width / this.config.gridLines.size; i++) {
					output += this.drawLine(i * this.config.gridLines.size, graphTop, i * this.config.gridLines.size, graphBottom, this.config.gridLines.stroke, this.config.gridLines.strokeWidth);
				}	
			}	

			//draw data labels and points
			for (var j = 0; j < currentGraph.numRows; j++) {
				var columnLeft = ((j+1) / (currentGraph.numColumns + 1)) * this.config.graphSize.width;
				var dataHeight = parseInt(this.config.graphSize.height) + (((currentGraph.yAxis[j] - currentGraph.min) / (currentGraph.max - currentGraph.min)) * -this.config.graphSize.height);

				//datapoints
				output += this.drawCircle(columnLeft, dataHeight, this.config.graphPoints.radius);

				//datalabels
				output +=  this.drawText(columnLeft, dataHeight, 'black', '4', currentGraph.yAxis[j]);
			}

			output += '</svg><figcaption>' + currentGraph.title + '</figcaption></figure>';

			this.targetTables[graphIndex].insertAdjacentHTML('afterend', output);

			document.getElementById(this.config.outputID + '-' + currentGraph.id).children[0].style.cssText = "border:" + this.config.graphBorder.width + " solid " + this.config.graphBorder.color + ";";
		};
		
	};

	this.drawLine = function(x1, y1, x2, y2, strokeColor, strokeWidth) {
		var line = '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="' + strokeColor + '" stroke-width = "' + strokeWidth + '"/>';

		return line;
	};

	this.drawText = function(x, y, textColor, fontSize, textString) {
		var text = '<text x="' + x + '" y="' + y + '" dx="2" fill="' + textColor + '" font-size="' + fontSize + '">';

		text += textString.toString() + '</text>';

		return text;
	};

	this.drawCircle = function(cx, cy, r) {
		var circle = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + this.config.graphPoints.color + '" stroke="' + this.config.graphPoints.stroke + '" stroke-width="' + this.config.graphPoints.strokeWidth + '" />';

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