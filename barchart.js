var barfunc = function (param) {
    if(param!="quit"){param = [...new Set(param)];}
  //console.log(param);
  var dic = { 1: "#00b36b", 2: "#8c1aff", 3: "#ffa600" };
  Plotly.d3.csv("Instance_data.csv", function (err, rows) {
    var lis;
    function test(rows, key, past) {
      lis = [];
      $(past).each(function (i, val) {
        lis.push(
          rows.map(function (row) {
            return row[key];
          })[val - 1]
        );
      });
     // console.log(lis);
      return lis;
    }
    dumm = [];
    dumm = test(rows, "class_new", param);
    console.log(dumm);

    var counts = {};
    for (var i = 0; i < dumm.length; i++) {
      counts[dumm[i]] = 1 + (counts[dumm[i]] || 0);
    }
    console.log(counts);

    console.log(Object.values(counts));

    var uniqu = [...new Set(test(rows, "class_new", param))];
    var colorscale_fix;

    //console.log(uniqu.length)


    //console.log(uniqu);
    if (uniqu.length == 2) {
      if (JSON.stringify(uniqu.sort()) === JSON.stringify(["1", "2"])) {
        colorscale_fix = 
          ["#00b36b", "#8c1aff"]
        
      } else if (JSON.stringify(uniqu.sort()) === JSON.stringify(["2", "3"])) {
        colorscale_fix =           ["#8c1aff","#ffa600"]
      } else if (JSON.stringify(uniqu.sort()) === JSON.stringify(["1", "3"])) {
        colorscale_fix = 
          ["#00b36b", "#ffa600"]
        
      }
        
      } 
      else if (uniqu.length == 1) {
        //console.log(dic[uniqu[0]]);
        colorscale_fix = dic[uniqu[0]];
      }
      else if(uniqu.length ==3){
       colorscale_fix = ["#00b36b", "#8c1aff", "#ffa600"];
      }

    if (param == "quit") {
      var data = [
        {
          x: ["Class1", "Class2", "Class3"],
          y: [0,0,0],
          type: "bar",
        },
      ];
      var layout = {
        width: 400,
        height: 400,
      };

      Plotly.newPlot("myDiv", data,layout);
    } else {
      var data = [
        {
          x: ["Class1", "Class2", "Class3"],
          y: Object.values(counts),
          marker: {
            // color: ["#3385ff", "#ff8c1a"],
            color: colorscale_fix,
          },
          type: "bar",
        },
      ];
      var layout = {
        width: 400,
        height: 400,
      };

      Plotly.newPlot("myDiv", data,layout);
    }
  });
};
