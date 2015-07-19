# Grafici

Grafici is a dead-simple JavaScript-based SVG graph generator for simple charting purposes. Provide Grafici with a table of numerical data and it will generate a simple SVG graph and insert it into the DOM. 

It is designed to be as lightweight as possible, with no dependencies. 

## Usage

Include `grafici.js` in your page. 

```markup
<script src="grafici.js"></script>
```

Then instantiate a new Grafici object by passing in a new configuration object to the constructor as follows:

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

## Intended use case

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

Animations and styling are for the most part the individual user's concern. Any styles, animations, or interactivity seen in the examples are most likely