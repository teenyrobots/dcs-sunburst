// SOLUTIONS MATRIX D3 SUNBURST EDITION

// colors
let colors1 = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "brown",
  "grey",
  "lightgrey",
  "pink",
  "lightblue"
]

let colors2 = [
  "67, 57, 149",
  "114, 17, 48",
  "0, 151, 207",
  "113, 137, 66",
  "102, 56, 240",
  "255, 169, 0",
  "31, 8, 151",
  "212, 21, 134",
  "0, 184, 141",
  "255, 102, 77",
  "27, 1, 71",
  "131, 186, 18"
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

function objectify(theData) {
  let newObject = [];
  for (var i in theData) {
    let newObjectum = theData[i].interventions;
    console.log("the new objectum is "+newObjectum);
    newObject.push(newObjectum);
  }
  return newObject;
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
  let outerRadius = w * .5,
	 innerRadius = h * .25,
   arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius),
  innerArc = d3.arc()
     .innerRadius(innerRadius * .8)
     .outerRadius(outerRadius * .9);

//OLD PIE
  // let pie = d3.pie()
  //   .sort(null);

// NEW AND IMPROVED PIE
  let pie = d3.pie()
    .value(function(d) {
      return d.interventions.length;
    })
    .sort(null);

  let lilpie = d3.pie()

    .sort(null);

  // this is the svg the viz will be inside
  let svg = d3.select(id).append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  let arcs = svg.selectAll("g.arc")
      // .data(pie(arrayify(theData)))
      .data(pie(theData))
      .enter()
      .append('g')
      .attr("transform", "translate("+ outerRadius + "," + outerRadius +")");

    arcs.append("path")
      .attr("fill", function(d, i) {
        let arcColor = "rgba("+colors2[i]+", 0.75)";
        return arcColor;
      })
      .attr("d", arc);

    arcs.append("svg:text")
      .attr("transform", function(d) {
        let c = arc.centroid(d);
        return "translate(" + c[0] +"," + c[1] + ")rotate(" + angleOuter(d) + ")";
      })
      .attr("text-anchor", "middle")
      .attr('dy', '-75') //center the text on it's origin
      .text(function(d, i){
        let a = theData[i].title;
        return a; //get the label from our original data array
      })
      .classed("labels", true)

      // Computes the angle of an arc, converting from radians to degrees.
      function angleOuter(d) {
        let a = (d.startAngle + d.endAngle) * 90 / Math.PI;
        return a;
      //RETURN UPSIDE DOWN FOR BOTTOM?? this is super broken
        // if (a > 90 && a < 270) {
        //   return a-180;
        // } else {
        //   return a;
        // }
      }

//MAKE INNER PIE
  let innerArcs = svg.selectAll("g.innerArc")
      .data(lilpie(innerArray(theData)))
      .enter()
      .append('g')
      .attr("transform", "translate("+ outerRadius + "," + outerRadius +")");

  let currentIndex = 0;
  let dataObject = objectify(theData);
  let adder = dataObject[currentIndex];

    innerArcs.append("path")
      .attr("fill", function(d, i) {
        if (i < adder) {
          let lilColor = "rgb(" + colors2[currentIndex] + ")";
          return lilColor;
        } else if (i == adder){
          currentIndex += 1;
          adder += dataObject[currentIndex].length;
          let lilColor = "rgb(" + colors2[currentIndex] + ")";
          return lilColor;
        }  else {
          let lilColor = "pink";
        }

      })
      .attr("stroke", "white")
      .attr("d", innerArc)
      .on("mouseover", function() { d3.select(this)
          .classed("orange", true);
      })
      .on("mouseout", function(d) { d3.select(this)
          .classed("orange", false);
      })
      .on("click", function(d, i)
        {
          d3.select("#intialContent").style("display", "none");
          d3.select("#content").style("display", "block");
          let title = d3.select('#title');
          title.text(innerArrayContent(theData)[i]);
        }
    )

    innerArcs.append("svg:text")
      .attr("transform", function(d) {
        return "translate(" + innerArc.centroid(d) + ")rotate(" + angleInner(d) + ")";
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .text(function(d, i)
        {
          let a = innerArrayContent(theData)[i];
          return a; //get the label from our original data array
        }
      )
      .attr('dy', '+5')
      .classed("labels", true)
      // Computes the angle of an arc, converting from radians to degrees.
      function angleInner(d) {
        var a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;
        return a > 90 ? a - 180 : a;
      }


}
