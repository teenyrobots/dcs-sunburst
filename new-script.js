var vData = {
    'id': 'TOPICS', 'children': [{
        'id': 'Topic A',
        'children': [{'id': 'Sub A1', 'size': 1}, {'id': 'Sub A2', 'size': 1}]
    }, {
        'id': 'Topic B',
        'children': [{'id': 'Sub B1', 'size': 1}, {'id': 'Sub B2', 'size': 1},
	        {'id': 'Sub B3', 'size': 1}]
    }, {
        'id': 'Topic C',
        'children': [{'id': 'Sub A1', 'size': 1}, {'id': 'Sub A2', 'size': 1}]
    }]
};




var vWidth = 300;  // <-- 1
var vHeight = 300;
var vRadius = Math.min(vWidth, vHeight) / 2;  // < -- 2
var vColor = d3.scaleOrdinal(d3.schemeCategory20b);   // <-- 3

var g = d3.select('svg')  // <-- 1
    .attr('width', vWidth)  // <-- 2
    .attr('height', vHeight)
    .append('g')  // <-- 3
    .attr('transform',
        'translate(' + vWidth / 2 + ',' + vHeight / 2 + ')');  // <-- 4

var vLayout = d3.partition()  // <-- 1
    .size([2 * Math.PI, vRadius]);  // <-- 2

var vArc = d3.arc()
    .startAngle(function (d) { return d.x0 })
    .endAngle(function (d) { return d.x1 })
    .innerRadius(function (d) { return d.y0 })
    .outerRadius(function (d) { return d.y1 });

var vRoot = d3.hierarchy(vData)  // <--1
  .sum(function (d) {
    console.log(d);
    return d.size; });  // <-- 2
var vNodes = vRoot.descendants();  // <--3
vLayout(vRoot);  // <--4

var vSlices = g.selectAll('path') // <-- 1
    .data(vNodes)  // <-- 2
    .enter()  // <-- 3
    .append('path'); // <-- 4

vSlices.filter(function(d) { return d.parent; })
    .attr('d', vArc)
    .style('stroke', '#fff')
    .style('fill', function (d) {
        return vColor((d.children ? d : d.parent).data.id); });
