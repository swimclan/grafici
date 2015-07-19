# Grafici

Grafici is a dead-simple JavaScript-based SVG graph generator for simple charting purposes. Provide Grafici with a table of numerical data and it will generate a simple SVG graph and insert it into the DOM. 

It is designed to be as lightweight as possible, with no dependencies. 

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