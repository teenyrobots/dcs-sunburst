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

let colors = [
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

let colors4 = [
  "222, 170, 33",
  "225, 162, 49",
  "228, 154, 63",
  "231, 145, 74",
  "233, 137, 86",
  "236, 129, 97",
  "239, 120, 108",
  "241, 113, 118",
  "244, 104, 128",
  "247, 96, 139",
  "249, 87, 150",
  "250, 82, 159"
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

function innerArrayContentOpp(theData) {
  let newArray = [];
  for (var i in theData) {
    for (j in theData[i].interventions) {
      let newDatum = {};
      newDatum.int = theData[i].interventions[j];
      newDatum.cat = theData[i].title;
      newDatum.color = colors[i];
      newArray.push(newDatum);
    }
  }
  return newArray;
};


function innerArray(theData) {
  let newArray = innerArrayContentOpp(theData)
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
  let outerRadius = w * .5,
	 innerRadius = h * .425,
   arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius),
  innerArc = d3.arc()
     .innerRadius(innerRadius * .45)
     .outerRadius(outerRadius * .9);

   let bigPie = d3.pie()
     .value(function(d) {
       return d.interventions.length;
     })
     .sort(null);

   let lilPie = d3.pie()
     .sort(null);

  // this is the svg the viz will be inside
  let svg = d3.select(id).append("svg")
    .attr("width", w + margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  let arcs = svg.selectAll("g.arc")
      .data(bigPie(theData))
      .enter()
      .append('g')
      .attr("transform", "translate("+ outerRadius + "," + outerRadius +")");

    arcs.append("path")
      .attr("fill", function(d, i) {
        let arcColor = "rgba("+colors[i]+", 0.75)";
        return arcColor;
      })
      .attr("d", arc);

    arcs.append("text")
      .attr("transform", function(d) {
        let c = arc.centroid(d);
        return "translate(" + c[0] +"," + c[1] + ")rotate(" + angleOuter(d) + ")";
      })
      .attr("text-anchor", "middle")
      // .attr('dy', '-75')
      .text(function(d, i){
        let a = theData[i].title;
        return a; //get the label from our original data array
      })
      .classed("labels", true)

      // Computes the angle of an arc, converting from radians to degrees.
      function angleOuter(d) {
        let a = (d.startAngle + d.endAngle) * 90 / Math.PI;
        console.log(a);
        // return a;

      //RETURN UPSIDE DOWN FOR BOTTOM?? this is super broken
        if (a > 90 && a < 270) {
          return a-180;
        } else {
          return a;
        }
      }

//MAKE INNER PIE

  let dataOpp = innerArrayContentOpp(theData);

  let innerArcs = svg.selectAll("g.innerArc")
      .data(lilPie(innerArray(theData)))
      .enter()
      .append('g')
      .attr("transform", "translate("+ outerRadius + "," + outerRadius +")");


    innerArcs.append("path")
      .classed("path", true)
      .attr("fill", function(d, i) {
        let arcColor = "rgb(" + dataOpp[i].color + ")";
        return arcColor;
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
          let title = d3.selectAll('.title');
          let cat = d3.selectAll('.cat');

          title.text(dataOpp[i].int);
          cat.text(dataOpp[i].cat);

          d3.selectAll(".path").classed("selected", false);
          d3.select(this).classed("selected", true);
        }
    )

    function exShow() {
      getElementById('#exShow').setAttribute("style", "display: flex;")
    }

    innerArcs.append("svg:text")
      .attr("transform", function(d, i) {
        return "translate(" + innerArc.centroid(d) + ")rotate(" + angleInner(d, i) + ")";
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .text(function(d, i)
        {
          let a = dataOpp[i].int;
          return a; //get the label from our original data array
        }
      )
      .attr('dy', '+5')
      .classed("labels", true)

      // Computes the angle of an arc, converting from radians to degrees.
      function angleInner(d, i) {
        let a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;

    //THIS TRIES TO CONSIDER NEXT DATA IN FLIPPING EQUATION, BUT IT'S HONESTLY A PRETTY BOGUS SOLUTION
        if (dataOpp[i+1] === undefined) {
          return a;
        } else {
          if (a > 90 && dataOpp[i+1].cat === dataOpp[i].cat) {
            a = a-180;
            return a;
          } else if (a > 95) {
            a = a-180;
            return a;
          } else {
            return a;
          }
        }

        // if (a > 90) {
        //   a = a-180;
        //   return a;
        // } else {
        //   return a;
        // }

        // return a > 90 ? a - 180 : a;
      }
}
