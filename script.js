// SOLUTIONS MATRIX D3 SUNBURST EDITION

//This fuction generates THE viz on index.html
d3.json("data.json", function(data) {
  theData = data;
  sunburst("#sunburstViz");
});

//-------------------------------------------------
//Here are some helper functions for sunburst generation

let colors = [
  "211, 228, 241",
  "226, 240, 251",
  "197, 215, 229",
  "211, 228, 241",
  "226, 240, 251",
  "197, 215, 229",
  "211, 228, 241",
  "226, 240, 251",
  "197, 215, 229",
  "211, 228, 241",
  "226, 240, 251",
  "197, 215, 229",
  "211, 228, 241",
  "226, 240, 251",
  "197, 215, 229"
]

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

function exShow() {
  document.getElementById('ex').setAttribute("style", "display: flex;");
}

function exBye() {
  document.getElementById('ex').setAttribute("style", "display: none;");
}

//---------------------------------------------------------------------
//This is the D3 function that actually generates sunbursts

function sunburst(id){

  // bostock's margin convention leaves room for scales
  let margin = {top: 50, right: 50, bottom: 10, left: 50};

  //FINAL SIZE OF VIZ
  let w = 1000 - margin.left - margin.right;
  let h = 1000  - margin.top - margin.bottom;

  //MAKES CIRCLES
  let outerRadius = w * .5,
	 innerRadius = h * .425,
   arc = d3.arc()
    .innerRadius(innerRadius)
    .outerRadius(outerRadius),
  innerArc = d3.arc()
     .innerRadius(innerRadius * .5)
     .outerRadius(outerRadius * .9);

  let bigPie = d3.pie()
     .value(function(d) {return d.interventions.length;})
     .sort(null);
   let lilPie = d3.pie()
     .sort(null);

  //THE MAIN SVG
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

//WRITES THE OUTER LABELS
  arcs.append("text")
    .attr("transform", function(d) {
      let c = arc.centroid(d);
      return "translate(" + c[0] +"," + c[1] + ")rotate(" + angleOuter(d) + ")";
    })
    .attr("text-anchor", "middle")
    .attr("dominant-baseline", "mathematical")
    .text(function(d, i){
        let a = theData[i].title;
        return a; //get the label from our original data array
    })
      .classed("labels", true)

      // Computes the angle of an arc, converting from radians to degrees.
      function angleOuter(d) {
        let a = (d.startAngle + d.endAngle) * 90 / Math.PI;

      //RETURN UPSIDE DOWN FOR BOTTOM
        if (a > 90 && a < 270) {
          return a-180;
        } else {
          return a;
        }
      }

//MAKE INNER PIE
  //this is the opposite land data that you can reference to get info about
  //current intervention, but I did a bad job of matching up the key names to
  //the original data structure bc I was hacking :(
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
          d3.select("#content").style("display", "flex");
          let title = d3.selectAll('.title');
          let cat = d3.selectAll('.cat');
          let short = d3.selectAll('.short');
          let ex = d3.selectAll('.examples');
          let descrip = d3.selectAll('.descrip');

          title.text(dataOpp[i].int.name);
          cat.text(dataOpp[i].cat);
          short.text(dataOpp[i].int.short);
          descrip.text(dataOpp[i].int.description);
          ex.selectAll("li").remove();
          for (z in dataOpp[i].int.examples) {
            if (dataOpp[i].int.examples[z].url) {
              ex.append("li")
                .append("a")
                  .text(dataOpp[i].int.examples[z].text)
                  .attr("href", dataOpp[i].int.examples[z].url)
                  .attr("target", "_blank");
            } else {
              ex.append("li")
                .append("p")
                  .text(dataOpp[i].int.examples[z].text);
            }
          };

          d3.selectAll(".path").classed("selected", false);
          d3.select(this).classed("selected", true);
        }
    )

    innerArcs.append("svg:text")
      .attr("transform", function(d, i) {
        return "translate(" + innerArc.centroid(d) + ")rotate(" + angleInner(d, i) + ")";
      })
      .attr("text-anchor", "middle") //center the text on it's origin
      .text(function(d, i)
        {
          let a = dataOpp[i].int.name;
          return a; //get the label from our original data array
        }
      )
      .attr('dy', '+5')
      .classed("labels", true)

      // Computes the angle of an arc, converting from radians to degrees.
      function angleInner(d, i) {
        let a = (d.startAngle + d.endAngle) * 90 / Math.PI - 90;

    //This flips the left side of the sunburst based on the current dataset
    //Ideally it would flip entire categories after 90 degrees, but it is not automatic
        if (dataOpp[i+1] === undefined) {
          return a-180;
        } else {
          if (a > 95) {
            a = a-180;
            return a;
          } else {
            return a;
          }
        }
      }

}
