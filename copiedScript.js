// Variables
var width = 500;
var height = 500;
var radius = Math.min(width, height) / 2;
var color = d3.scaleOrdinal(d3.schemeCategory20b);

// Size our <svg> element, add a <g> element, and move translate 0,0 to the center of the element.
var g = d3.select('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g')
    .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

// Create our sunburst data structure and size it.
var partition = d3.partition()
    .size([2 * Math.PI, radius]);

// Get the data from our JSON file
d3.json("data2.json", function(error, nodeData) {
    if (error) throw error;

    // Find the root node of our data, and begin sizing process.
    var root = d3.hierarchy(nodeData)
        .sum(function (d) { return d.size});

    // Calculate the sizes of each arc that we'll draw later.
    partition(root);
    var arc = d3.arc()
        .startAngle(function (d) { return d.x0 })
        .endAngle(function (d) { return d.x1 })
        .innerRadius(function (d) { return d.y0 })
        .outerRadius(function (d) { return d.y1 });


    // Add a <g> element for each node in thd data, then append <path> elements and draw lines based on the arc
    // variable calculations. Last, color the lines and the slices.
    g.selectAll('g')
        .data(root.descendants())
        .enter().append('g').attr("class", "node").append('path')
        .attr("display", function (d) { return d.depth ? null : "none"; })
        .attr("d", arc)
        .style('stroke', '#fff')
        .style("fill", function (d) { return color((d.children ? d : d.parent).data.name); });


    // Populate the <text> elements with our data-driven titles.
    g.selectAll(".node")
        .append("text")
        .attr("transform", function(d) {
            return "translate(" + arc.centroid(d) + ")rotate(" + computeTextRotation(d) + ")"; })
        .attr("dx", "-20") // radius margin
        .attr("dy", ".5em") // rotation align
        .text(function(d) { return d.parent ? d.data.name : "" });

});


/**
 * Calculate the correct distance to rotate each label based on its location in the sunburst.
 * @param {Node} d
 * @return {Number}
 */
function computeTextRotation(d) {
    var angle = (d.x0 + d.x1) / Math.PI * 90;

    // Avoid upside-down labels
    return (angle < 120 || angle > 270) ? angle : angle + 180;  // labels as rims
    //return (angle < 180) ? angle - 90 : angle + 90;  // labels as spokes
}
