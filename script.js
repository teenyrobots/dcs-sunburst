// SOLUTIONS MATRIX D3 SUNBURST EDITION

// colors
let colors1 = [
  "red",
  "blue",
  "green"
]

// this function takes the data and ports it into the function that generates the viz
d3.json("data.json", function(data) {
  theData = data;

  // the function to do something with the data
  // this function is a placeholder and doesn't actually do anything yet
  sunburst("#sunburstViz");

});

// helper functions
function arrayify(theData) {
  let newArray = [];
  for (var i in theData) {
    let newDatum = theData[i].interventions.length;
    newArray.push(newDatum);
  }
  return newArray;
}

function innerArrayContent(theData) {
  let newArray = [];
  for (var i in theData) {
    for (j in theData[i].interventions) {
      let newDatum = theData[i].interventions[j];
      newArray.push(newDatum);
    }
  }
  return newArray;
};

function innerArray(theData) {
  let newArray = innerArrayContent(theData)
  let numericArray = [];
  for (i in newArray) {
    numericArray.push(newArray.length / newArray.length);
  }
  return numericArray;
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
	 innerRadius = h * .25,
   arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius),
  innerArc = d3.arc()
     .innerRadius(innerRadius * .8)
     .outerRadius(outerRadius * .8);

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
      .attr("fill", function(d, i) {
        return colors1[i];
      })
      .attr("d", arc);

  console.log(innerArrayContent(theData));

  let innerArcs = svg.selectAll("g.innerArc")
      .data(pie(innerArray(theData)))
      .enter()
      .append('g')
      .attr("transform", "translate("+ outerRadius + "," + outerRadius +")");

    innerArcs.append("path")
      .attr("fill", function(d, i) {
        if(i < 10) {
          let lilColor = "rgb(255,"+ i*10 +", 255)";
          console.log(lilColor);
          return lilColor;
        } else if (i < 20){
          let lilColor = "rgb(255, 255,"+ i*10 +")";
          console.log(lilColor);
          return lilColor;
        } else {
          return "#000";
        }
      })
      .attr("stroke", "white")
      .attr("d", innerArc)
      .on("click", function(d, i) {
        svg.append("text")
          .text(innerArrayContent(theData)[i])
          .attr("x", w/2)
          .attr("y", h/2)
          .style("text-anchor", "middle");
        console.log(innerArrayContent(theData)[i]);
    });


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
