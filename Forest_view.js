var mainChart = function () {
  var size = { width: 2050, height: 1000 };
  var filename = "Rule_data_umap.csv"; //projection
  var attr = ["x", "y"]; //X and Y attributes to use

  var canvas = d3
    .select("#canvas")
    .append("svg")
    .attr("width", size.width)
    .attr("height", size.height)
    .append("g");


  d3.csv(filename, type).then(function (data) {
    data = normalize(data, attr);
    var gridsize = gridaspectratio(data, 1); //1.8
    var grid = grid_rec(data, gridsize);
    drawgrid(canvas, grid, { width: 30, height: 30});
  });

   var tool_tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([20, 120])
    .html("<p>Setosa probability:</p><div id='tipDiv'></div></br><p>Versicolor probability:</p><div id='tipDivnew'></div></br><p>Virginica probability:</p><div id='tipDivnew1'></div></br><p>Rule coverage:</p><div id='dynTip'></div>");

    canvas.call(tool_tip);


  function drawgrid(canvas, grid, size = { width: 5, height: 5 }) {
    canvas
      .selectAll("g")
      .data(grid)
      .join(
        (enter) => {
          var data = grid;

          // set the color scale
          var color = d3
            .scaleOrdinal()
            .domain(data)
            // .range(["green","orange","blue"]);
            .range(["#ffa600","#00b36b", "#8c1aff"]);

          var pie = d3.pie().value(function (d) {
            return d.value;
          });

         testnew = enter
            .append("g")
            .attr("id", function (d) {
              return "R" + d.rule;
            })
            .attr("class","forest")
            // .style("opacity", function (d) {
            //   if (d.coverage > 0.7) {
            //     return 1;
            //   } else if (d.coverage < 0.5) {
            //     return 0.6;
            //   }
            // })
            /*
            .style("stroke", function (d) {
              if (d.rule <=27) {
                return "black";
              }
            })*/
            // .style("stroke-width", 1.2)
            // .on("mouseover", mouseover)
            // .on("mousemove", mousemove)
            // .on("mouseleave", mouseleave)
            .on('mouseover', function(d) {
                // console.log("Class0")
                // console.log(d)
                 tool_tip.show();
                 var tipSVG = d3.select("#tipDiv")
                   .append("svg")
                   .attr("width", 200)
                   .attr("height", 50);
 
                   //var testing = [14, 27, 19, 6, 17];
                 
                 //  tipSVG.selectAll("mybar")
                   tipSVG.data(grid)
                   //.enter()
                   .append("rect")
                  // .attr("x", 2)
                   .attr("y", 10)
                   .attr("width", 0)
                   .attr("height", 30)
                   .transition()
                   .duration(1000)
                   .attr("width", d.setosa/2)
                   .attr("fill", "#00b36b")
             
                 // tipSVG.data(grid)
                 // .enter()
                 tipSVG.append("text")
                   .text(d.setosa + "%")
                   .attr("x", 10)
                   .attr("y", 30)
                   .transition()
                   .duration(1000)
                   .attr("x", d.setosa/2)
         
                  // console.log("Class1")
                // console.log(d)
                 //tool_tip.show();
                 var tipSVGnew = d3.select("#tipDivnew")
                   .append("svg")
                   .attr("width", 200)
                   .attr("height", 50);
 
                   //var testing = [14, 27, 19, 6, 17];
                 
                 //  tipSVG.selectAll("mybar")
                 tipSVGnew.data(grid)
                   //.enter()
                   .append("rect")
                  // .attr("x", 2)
                   .attr("y", 10)
                   .attr("width", 0)
                   .attr("height", 30)
                   .transition()
                   .duration(1000)
                   .attr("width", d.versicolor/2)
                   .attr("fill", "#8c1aff")
             
                 // tipSVG.data(grid)
                 // .enter()
                 tipSVGnew.append("text")
                   .text(d.versicolor + "%") 
                   .attr("x", 10)
                   .attr("y", 30)
                   .transition()
                   .duration(1000)
                   .attr("x", d.versicolor/2)

                   var tipSVGnew1 = d3.select("#tipDivnew1")
                   .append("svg")
                   .attr("width", 200)
                   .attr("height", 50);
 
                   //var testing = [14, 27, 19, 6, 17];
                 
                 //  tipSVG.selectAll("mybar")
                 tipSVGnew1.data(grid)
                   //.enter()
                   .append("rect")
                  // .attr("x", 2)
                   .attr("y", 10)
                   .attr("width", 0)
                   .attr("height", 30)
                   .transition()
                   .duration(1000)
                   .attr("width", d.virginica/2)
                   .attr("fill", "#ffa600")
             
                 // tipSVG.data(grid)
                 // .enter()
                 tipSVGnew1.append("text")
                   .text(d.virginica + "%") 
                   .attr("x", 10)
                   .attr("y", 30)
                   .transition()
                   .duration(1000)
                   .attr("x", d.virginica/2)
         
                var dynamic_tip = d3.select("#dynTip")
                .append("svg")
                .attr("width", 100)
                .attr("height", 40);

                dynamic_tip.append("text")
                .text(d.coverage*100 + "%") 
                .attr("x", 0)
                .attr("y", 30)
                // .transition()
                // .duration(1000)
                // .attr("x", d.class1/2)

                 
               })
               .on('mouseout', tool_tip.hide)
           
            .on("click", function (d) {
              // console.log([d.mixnew]);
              if (d.rule <= 12) {
                d3.selectAll(".forest").style("stroke", "None");
                d3.select(this).style("stroke", "black");
                var cols = document.getElementsByClassName("filter");
                for (i = 0; i < cols.length; i++) {
                  cols[i].style.stroke = "none";
                  cols[i].style["stroke-width"] = 0;
                }
                x = d.mixnew.split(",");
                for (var i = 0; i < x.length; i++) {
                  document.getElementById(x[i]).style.stroke = "Red";
                  document.getElementById(x[i]).style["stroke-width"] = 2;
                }
              }
              var pass_all = [d.mixnew.split(",")];
              var testing = [];
              pass_all = pass_all.forEach(function (inst) {
                var tst = inst.forEach(function (val) {
                  val = val.slice(1);
                  testing.push(val);
                });
              });
              //console.log(testing);
              parallelC_f(testing);
            })
            .attr("transform", function (d) {
              return (
                "translate(" +
                (size.width * d.j + 80) +
                "," +
                (size.height * d.i + 80) +
                ")"
              );
            })

            .selectAll("whatever")
            .data(function (d) {
              return pie(d3.entries(d.pieval.split(",")));
            })

            .enter()
            .append("path")
            .data(function (d) {
              let mymap = d.pieval.split(",").map((e, i) => {
                return { key: i, value: e, size: d.coverage, rule: d.rule,
                  mixes: d.mixnew, };
              });

              return pie(mymap);
            })
            .attr(
              "d",
              d3
                .arc()
                .innerRadius(0)
                .outerRadius(function (d) {
                  if (d.data.size >= 0.7) return 14;
                  else if (d.data.size >= 0.3 && d.data.size < 0.7) return 11;
                  else return 8;
                })
            )
            .attr("fill", function (d) {
              return color(d.data.key);
            });


          //LASSO code:
          var lasso_start = function () {
            lasso
              .items()
              .attr("r", 6) // reset size
              .classed("not_possible", true)
              .classed("selected", false);
          };

          var lasso_draw = function () {
            // Style the possible dots
            lasso
              .possibleItems()
              .classed("not_possible", false)
              .classed("possible", true);

            // Style the not possible dot
            lasso
              .notPossibleItems()
              .classed("not_possible", true)
              .classed("possible", false);
          };
          //var lasso_ele = [];
          var lasso_end = function () {
            // Reset the color of all dots
            lasso
              .items()
              .classed("not_possible", false)
              .classed("possible", false);
            lasso_ele = [];
            // Style the selected dots
            var lis_unique = [];
            var testing = [];
            lasso
              .selectedItems()
              .classed("selected", true)
              .attr("r", 6)
              .style("stroke", function (d) {
                if (d.data.rule <= 12) {
                  if (lis_unique.includes(d.data.rule)) {
                  } else {
                    lis_unique.push(d.data.rule);
                    var pass_all = [d.data.mixes.split(",")];
                    pass_all = pass_all.forEach(function (inst) {
                      inst.forEach(function (val) {
                        val = val.slice(1);
                        testing.push(val);
                      });
                    });
                  }

                  //parallelC_f(testing)
                  return "red";
                }
              })
              .style("stroke-width", 2)
              .style("opacity", 1);

  d3.selectAll(".filter").style("stroke",function(m){
                if (m.mapping == "NonMatch") {   
                  var color_scale = d3
            .scaleOrdinal()
            //.range(["orange", "green", "purple", "white"]);
            .range(["#3385ff", "#ff8c1a", "#99cc00", "white"]);
                      return color_scale(m.color_new);
                    } else {
                      return "None";
                    }
                // testing.includes(m.)
              })
  
              d3.selectAll(".filter").style("stroke",function(m){
                // console.log(m)
                if(testing.includes(m.instance)){
                  return "red"
                }
                // testing.includes(m.)
              })
              
            // console.log(lis_unique, testing);
            if (testing.length != undefined) {
              parallelC_f(testing);
              barfunc(testing);
            } else {
              parallelC_f("quit");
            }
            //  console.log(lasso_ele);

            // Reset the style of the not selected dots
            lasso
              .notSelectedItems()
              .attr("r", 6)
              .style("opacity", 1)
              .style("stroke", function (d) {
                if (d.rule <= 12) {
                  return "None";
                }
              });
          };

          var lasso = d3
            .lasso()
            .closePathSelect(true)
            .closePathDistance(100)
            .items(testnew)
            .targetArea(canvas)
            .on("start", lasso_start)
            .on("draw", lasso_draw)
            .on("end", lasso_end);

          canvas.call(lasso);

               // Code to click on misclassified button:
          var buttonn = document.getElementById("mybutton");
          buttonn.onclick = function () {
            window.location.reload();
          };
        },
        (update) => {},
        (exit) => {}
      );

    //.attr("style", "outline: thin solid red;")
  }

  function grid_rec(data, gridsize) {
    var grid = data.map(function (d, i) {
      return {
        id: i + 1,
        x: d.x,
        y: d.y,
        i: 0,
        j: 0,
        //color: d.Pred_class,
        color_new: d.class,
        rule: d.Rule,
        mapping: d.Match,
        pieval: d.Pie,
        coverage: d.coverage,
        certainty: d.certainty,
        setosa: d.setosa,
        versicolor: d.versicolor,
        virginica: d.virginica,
        mixnew: d.Mix
      };
    });

    return grid_rec_aux(grid, gridsize, { i: 0, j: 0 }).sort(function (a, b) {
      return a.id - b.id;
    });
  }

  function grid_rec_aux(grid, size, corner) {
    if (grid.length > 0) {
      if (grid.length === 1) {
        grid[0].i = corner.i;
        grid[0].j = corner.j;
        return grid;
      } else {
        if (size.r > size.s) {
          var [grid0, grid1] = split_grid(
            grid,
            Math.ceil(size.r / 2) * size.s,
            "y"
          );

          grid_rec_aux(
            grid0,
            { r: Math.ceil(size.r / 2), s: size.s },
            { i: corner.i, j: corner.j }
          );

          grid_rec_aux(
            grid1,
            { r: size.r - Math.ceil(size.r / 2), s: size.s },
            { i: corner.i + Math.ceil(size.r / 2), j: corner.j }
          );

          return grid0.concat(grid1);
        } else {
          var [grid0, grid1] = split_grid(
            grid,
            Math.ceil(size.s / 2) * size.r,
            "x"
          );

          grid_rec_aux(
            grid0,
            { r: size.r, s: Math.ceil(size.s / 2) },
            { i: corner.i, j: corner.j }
          );

          grid_rec_aux(
            grid1,
            { r: size.r, s: size.s - Math.ceil(size.s / 2) },
            { i: corner.i, j: corner.j + Math.ceil(size.s / 2) }
          );

          return grid0.concat(grid1);
        }
      }
    }
  }

  function split_grid(grid, cutpoint, direction) {
    grid.sort(function (a, b) {
      return a[direction] - b[direction];
    });

    var grid0 = grid.slice(0, cutpoint).map(function (d) {
      return d;
    });
    var grid1 = grid.slice(cutpoint).map(function (d) {
      return d;
    });

    return [grid0, grid1];
  }

  function gridaspectratio(data, aspectratio) {
    var columns = Math.floor(Math.sqrt(data.length * aspectratio));
    var lines = Math.ceil(data.length / columns);
    return { r: lines, s: columns };
  }

  function type(d) {
    attr.forEach(function (value) {
      d[value] = +d[value];
    });
    return d;
  }

  function normalize(data, attributes) {
    attributes.forEach(function (value) {
      var scale = d3
        .scaleLinear()
        .range([0, 1])
        .domain(
          d3.extent(data, (d) => {
            return d[value];
          })
        );
      data.forEach(function (d) {
        d[value] = scale(d[value]);
      });
    });
    return data;
  }
};
