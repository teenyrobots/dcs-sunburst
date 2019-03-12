// SOLUTIONS MATRIX D3 SUNBURST EDITION

// this function takes the data and ports it into the function that generates the viz
d3.json("data.json", function(data) {
  theData = data;

  // the function to do something with the data
  // this function is a placeholder and doesn't actually do anything yet
  sunburst("#sunburstViz");

});

// helper functions
function arrayify(theData) {
  let newArray = []
  for (var i in theData) {
    let newDatum = theData[i].interventions.length;
    newArray.push(newDatum);
  }
  console.log(newArray);
  return newArray;
}

//
function sunburst(id){

  console.log('the sunburst function is running');

  // bostock's margin convention leaves room for scales and stuff
  let margin = {top: 50, right: 50, bottom: 10, left: 50};

  // this will be the size of the viz
  let w = 1000 - margin.left - margin.right;
  let h = 1000  - margin.top - margin.bottom;

  // just circle stuff
  let outerRadius = w / 2,
	 innerRadius = h / 5,
   arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius);

  let pie = d3.pie();

  // this is the svg the viz will be inside
  let svg = d3.select(id).append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  let arcs = svg.selectAll("g.arc")
      .data(pie(arrayify(theData)))
      .enter()
      .append('g')
      .attr("transform", "translate("+ outerRadius + "," + outerRadius +")");

    arcs.append("path")
      .attr("fill", "#ff5572")
      .attr("stroke", "white")
      .attr("d", arc);


  // print all the titles
  svg.selectAll("text")
    .data(theData)
    .enter()
    .append("text")
    .text(function(d){
      return d.title;
    })
    .attr("y", function(d, i) {
      return 50*i;
    })

}
