# Grafici

Grafici is a dead-simple JavaScript-based SVG graph generator for simple charting purposes. Provide Grafici with a table of numerical data and it will generate a simple SVG graph and insert it into the DOM. 

It is designed to be as lightweight as possible, with no dependencies. It leaves the table elements that serve as the graph data intact on the page, both to improve accessibility, and to allow for intelligent fallbacks when no JavaScript is present on a device, or the applied use case deems it inappropriate to display data in a graph, for example, as on a small screen.

## Usage

Include `grafici.js` in your page. 

```markup
<script src="grafici.js"></script>
```

Then instantiate a new Grafici object by passing in a configuration object to the constructor as follows:

```javascript
var graficiConfig = {
	tableClass: "grafici-example",
	outputID: "grafici-output",
	graphSize: {
		width: 200,
		height: 100,
		xAxisHeight: 10,
		yAxisWidth: 10,
		yAxisLabelFrequency: 3
	},
	graphBorder: {
		color: "#444",
		width: "0.075em"
	},
	gridLines: {
		size: 3,
		stroke: "rgb(20,100,200)",
		strokeWidth: 0.0625
	},
	graphPoints: {
		color: "rgb(20,180,250)",
		stroke: "transparent",
		strokeWidth: 8,
		radius: 1
	},
	graphLines: {
		stroke: "rgb(20,100,200)",
		strokeWidth: 0.5
	},
	barGraphLines: {
		stroke: "rgb(10,130,180)",
		strokeWidth: 8
	}
};

var grafici = new Grafici(graficiConfig);
```

Grafici will inspect the page for any table elements containing the class passed to the configuration object as the value of `graficiConfig.tableClass`. In the above example, the class Grafici will use to identify graph candidates for conversion is `.grafici-example`. 

As with any JavaScript designed to manipulate the DOM, it is recommended that this library be loaded only after a DOM ready event.

## Types of graphs

Grafici currently supports two formats of graphs: bar graphs and line graphs.

To generate a bar graph, add the class `grafici-bar-graph` to the table element you intend to target.

Likewise, to create a line graph, add the class `grafici-line-graph` to your table element in your HTML.

## Expected input format

This library is designed to do one thing well: generate SVG markup from table elements and insert it into the DOM. It expects a table of at most **two columns** of data, one for the X axis, and one for the Y axis. The input tables are expected to be formatted as follows:

```markup
<table class="grafici-example grafici-line-graph">
	<caption>Google stock prices at market close, Jul 6-Jul 17 2015</caption>
	<thead>
		<tr>
			<th>Date</th>
			<th>Price in USD</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Jul 6, 2015</td>
			<td>522.86</td>
		</tr>
		<tr>
			<td>Jul 7, 2015</td>
			<td>525.02</td>
		</tr>
		<tr>
			<td>Jul 8, 2015</td>
			<td>516.83</td>
		</tr>
		<tr>
			<td>Jul 9, 2015</td>
			<td>520.68</td>
		</tr>
		<tr>
			<td>Jul 10, 2015</td>
			<td>530.13</td>
		</tr>
		<tr>
			<td>Jul 13, 2015</td>
			<td>546.55</td>
		</tr>
		<tr>
			<td>Jul 14, 2015</td>
			<td>561.10</td>
		</tr>
		<tr>
			<td>Jul 15, 2015</td>
			<td>560.22</td>
		</tr>
		<tr>
			<td>Jul 16, 2015</td>
			<td>579.85</td>
		</tr>
		<tr>
			<td>Jul 17, 2015</td>
			<td>672.93</td>
		</tr>
	</tbody>
</table>
```

Animations and styling are for the most part the individual user's concern. Any styles, animations, or interactivity seen in the examples beyond the configuration object's scope are supplied on a custom basis by the user.

## Configuration

The configuration object is fairly straightfoward. Here is the example configuration object seen above with additional commenting for explanation as to its use:

```javascript
var graficiConfig = {
	tableClass: "grafici-example", //tableClass tells Grafici what table elements it should convert into graphs
	outputID: "grafici-output",    //outputID determines the prefix of the ID given to each converted graph, 
																 //which is then followed by a unique number
	graphSize: {
		width: 200,  							//width sets the viewBox width of the SVG
		height: 100, 							//height sets the viewBox height of the SVG
		xAxisHeight: 10,					//xAxisHeight sets the viewBox height of the xAxis data labels
		yAxisWidth: 10,						//yAxisWidth sets the viewBox width of the yAxis data labels
		yAxisLabelFrequency: 3		//yAxisLabelFrequency is a multiplier for changing how often the Y axis
															//data labels appear
	},
	graphBorder: {
		color: "#444",
		width: "0.075em"
	},
	gridLines: {
		size: 3,
		stroke: "rgb(20,100,200)",
		strokeWidth: 0.0625
	},
	graphPoints: {							//graphPoints are the circles that indicate a datapoint
		color: "rgb(20,180,250)",
		stroke: "transparent",
		strokeWidth: 8,
		radius: 1
	},
	graphLines: {								//graphLines determine the underlying grid's appearance
		stroke: "rgb(20,100,200)",
		strokeWidth: 0.5
	},
	barGraphLines: {						//barGraphLines set the appearance of the bar graph's lines
		stroke: "rgb(10,130,180)",
		strokeWidth: 8
	}
};

var grafici = new Grafici(graficiConfig);
```