var mainChartnew = function () {
  var size = { width: 2050, height: 1000 };
  var filename = "Instance_data.csv"; //projection
  var attr = ["x", "y"]; //X and Y attributes to use

  var canvasnew = d3
    .select("#canvasnew")
    .append("svg")
    .attr("width", size.width)
    .attr("height", size.height)
    .append("g");

  var table = d3
      .select("#table-location")
      .append("table")
      .attr("class", "table table-condensed table-striped")
      .attr("height", "500")
      .style("overflow", "auto"),
    thead = table.append("thead"),
    tbody = table.append("tbody");

  var Tooltip = d3
    .select("#cn")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  d3.csv(filename, type).then(function (data) {
    data = normalize(data, attr);
    var gridsize = gridaspectratio(data, 1); //1.8
    var grid = grid_rec(data, gridsize);
    drawgrid(canvasnew, grid, { width: 23, height: 23 });
  });

  var x;
  var mousemove = function (d) {
    if (d.instance <= 150) {
      Tooltip.style("opacity", 1);
      // d3.select(this).style("stroke", "black").style("opacity", 1);
    }
  };
  var mouseover = function (d) {
    Tooltip;
    if (d.instance <= 150) {
      Tooltip.html(
        "Instance no: " +
          d.instance +
          "</br>" +
          "Predicted class: " +
          d.color +
          "</br>" +
          "Stress: " + d.stress 
      )
        .style("opacity", "1")
        .style("right", d3.mouse(this)[0] -150  + "px")
        .style("top", d3.mouse(this)[1] + 100 + "px");
    }
  };
  var mouseleave = function (d) {
    if (d.instance <= 150) {
      Tooltip.style("opacity", 0);
      // d3.select(this).style("stroke", "none").style("opacity", 1);
    }
  };

  function drawgrid(canvasnew, grid, size = { width: 5, height: 5 }) {
    var color_scale = d3
      .scaleOrdinal()
      .range([ "#00b36b","#8c1aff", "#ffa600", "white"]);
      var list_p = [];

    //bind data
    var tns;

    canvasnew
      .selectAll("g")
      .data(grid)
      .join(
        (enter) => {
          enter
            .append("rect")
             .attr("class", "instance")
            .attr("id", function (d) {
              return "I" + d.instance;
            })
             .attr("width", size.width - 5)
            .attr("height", size.height - 5)
            .attr("x", function (d) {
                return size.width * d.j + 11;
            })
            .attr("y", function (d) {
                return size.height * d.i + 12;
            })
            .attr("rx", 2)								// how much to round corners - to be transitioned below
		.attr("ry", 2)	

            .style("fill", function (d) {
              return color_scale(d.color_new);
            })

            .style("stroke", function (d) {
              if (d.mapping == "NonMatch") {
                return color_scale(d.color);
                //return "red";
              }
            })
            .style("stroke-width", 4)
            .attr("class", function (d) {
              if (d.instance <= 150) {
                return "filter";
              }
            })
            .style("opacity", function (d) {
              if (d.stress >=0 && d.stress<= 0.025) {
                return 1;
              } 
              else if(d.stress>0.025 && d.stress<=0.05) {
                return 0.8;
              }
              else if(d.stress>0.05 && d.stress<=0.1){
                return 0.7
              }
              else if(d.stress>0.1 && d.stress<=0.2){
                return 0.6
              }
              else if(d.stress>0.2){
                return 0.5
              }
             // return 1
            })
            //.attr("style", "outline: thin solid red;")
            .attr("class", function (d) {
              if (d.instance <= 150) {
                return "filter";
              }
            })

            .on("mouseover", mouseover)
            .on("mousmove", mousemove)
            .on("mouseleave", mouseleave)

           
              .on("click", function (d) {
              if (d.instance <= 150) {
                var lis = [];

                if (list_p.includes(d)) {
                  const index = list_p.indexOf(d);
                  if (index > -1) {
                    list_p.splice(index, 1);
                  }
                  d3.selectAll("#I" + d.instance).style("stroke", function (d) {
                    if (d.mapping == "NonMatch") {
                      return color_scale(d.color);
                    } else {
                      return "None";
                    }
                  });
                } else {
                  list_p.push(d);
                }
                d3.selectAll(".forest").style("stroke", "none");
                list_p.forEach((element) => highlight(element));

                if (lis.length == 0) {
                  parallelC_f("quit");
                } else {
                  parallelC_f(lis);
                  //tables(lisnew);
                }
                // d3.select("I"+element.instance).style("stroke","black"));
                function highlight(element) {
                  d3.selectAll("#I" + element.instance).style(
                    "stroke",
                    "black"
                  )
                   d3.selectAll("#I" + element.instance).style(
                    "stroke-width",
                    "2.5"
                  );
                  x = element.mixnew.split(",");
                  for (var i = 0; i < x.length; i++) {
                    //console.log(document.getElementById(x[i]).style)
                    // console.log(document.getElementById(x[i]));

                    document.getElementById(x[i]).style.stroke = "Red";
                    document.getElementById(x[i]).style["stroke-width"] = 2;
                    document.getElementById(x[i]).style["opacity"] = 1;
                  }
                  lis.push(element.instance);
                }
              }
            });

            canvasnew
            .append("circle")
            .attr("cx", 730)
            .attr("cy", 20)
            .attr("r", 6)
            .style("fill","#ffa600");
          canvasnew
            .append("circle")
            .attr("cx", 730)
            .attr("cy", 40)
            .attr("r", 6)
            .style("fill", "#00b36b");
            canvasnew
            .append("circle")
            .attr("cx", 730)
            .attr("cy", 60)
            .attr("r", 6)
            .style("fill", "#8c1aff");
          canvasnew
            .append("text")
            .attr("x", 750)
            .attr("y", 20)
            .text("Class 0: Setosa")
            .style("font-size", "13px")
            .attr("alignment-baseline", "middle");
          canvasnew
            .append("text")
            .attr("x", 750)
            .attr("y", 40)
            .text("Class 1: Versicolor")
            .style("font-size", "13px")
            .attr("alignment-baseline", "middle");
            canvasnew
            .append("text")
            .attr("x", 750)
            .attr("y", 60)
            .text("Class 2: Virginica")
            .style("font-size", "13px")
            .attr("alignment-baseline", "middle");

          // enter
          //   .append("text")
          //   .attr("class", "label")
          //   .attr("id", function (d) {
          //     return d.instance;
          //   })
          //   .attr("font-size", 9)
          //   .attr("x", function (d) {
          //     return size.width * d.j + 4;
          //   })
          //   .attr("y", function (d) {
          //     return size.height * d.i + 7;
          //   })
          //   .attr("dy", ".8em")
          //   .text(function (d) {
          //     if (d.instance <= 150) {
          //       return d.instance;
          //     }
          //   })
          //   .on("mouseover", mouseover)
          //   .on("mousmove", mousemove)
          //   .on("mouseleave", mouseleave)

          //   .on("click", function (d) {
          //     if (d.instance <= 150) {
          //       var cols = document.getElementsByClassName("forest");
          //       for (i = 0; i < cols.length; i++) {
          //         cols[i].style.stroke = "none";
          //         cols[i].style["stroke-width"] = 0;
          //       }
          //       x = d.mixnew.split(",");
          //       for (var i = 0; i < x.length; i++) {
          //         document.getElementById(x[i]).style.stroke = "Red";
          //         document.getElementById(x[i]).style["stroke-width"] = 2.5;
          //       }
          //     } else {
          //       var cols = document.getElementsByClassName("forest");
          //       for (i = 0; i < cols.length; i++) {
          //         cols[i].style.stroke = "none";
          //         cols[i].style["stroke-width"] = 0;
          //       }
          //     }
          //   });

          //TABLE related:

          // var dat;

          // dat = grid.map(function (d) {
          //   return {
          //     Instance: d.instance,
          //     Vote1: d.Vote1,
          //     Vote2: d.Vote2,
          //     Vote3: d.Vote3,
          //     Final_Vote: d.Final_Vote,
          //     sepalLength: d.sepalLength
          //   };
          // });

          // var datafortab = dat.filter(function (d) {
          //   return d.Instance <= 150;
          // });

          // console.log(datafortab)
          // var columns = Object.keys(datafortab[0]);

          // var header = thead
          //   .append("tr")
          //   .selectAll("th")
          //   .data(columns)
          //   .enter()
          //   .append("th")
          //   .text(function (d) {
          //     return d;
          //   });

          // var rows = tbody
          //   .selectAll("tr")
          //   .data(datafortab)
          //   .enter()
          //   .append("tr")
          //   .on("mouseover", function (d) {
          //     d3.select(this).style("background-color", "yellow");
          //   })
          //   .on("mouseout", function (d) {
          //     d3.select(this).style("background-color", "transparent");
          //   });

          // var cells = rows
          //   .selectAll("td")
          //   .data(function (row) {
          //     return columns.map(function (d, i) {
          //       return { i: d, value: row[d] };
          //     });
          //   })
          //   .enter()
          //   .append("td")
          //   .html(function (d) {
          //     return d.value;
          //   });
          //TABLE ends:
        },
        (update) => {},
        (exit) => {}
      );

    //enter
  }

  function grid_rec(data, gridsize) {
    var grid = data.map(function (d, i) {
      return {
        id: i + 1,
        x: d.x,
        y: d.y,
        i: 0,
        j: 0,
        color: d.Pred_class,
        color_new: d.class,
        instance: d.Instance,
        mapping: d.Matches,
        mixnew: d.Mixnew,
        first: d.first,
        second: d.second,
        third: d.third,
        Vote1: d.Vote1,
        Vote2: d.Vote2,
        Vote3: d.Vote3,
        Final_Vote: d.Final_Vote,
        sepalLength: d.SepalLengthCm,
        sepalWidth: d.SepalWidthCm,
        petalLength: d.PetalLengthCm,
        petalWidth: d.PetalWidthCm,
        stress: d.Stress
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
          d3.extent(data, function (d) {
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
