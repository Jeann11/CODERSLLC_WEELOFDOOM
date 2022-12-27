document.addEventListener('DOMContentLoaded', function(event) {
    document.querySelector('body').style.opacity = 1
})

var padding = {top:20, right:100, bottom:0, left:0},
            w = 1000 - padding.left - padding.right,
            h = 1000 - padding.top  - padding.bottom,
            r = Math.min(w, h)/2,
            rotation = 0,
            oldrotation = 0,
            picked = 100000,
            oldpick = [],
            color = d3.scale.category20();
        var data = [
                    {"label":"CSS",  "value":1,  "question":"What CSS property is used for specifying the area between the content and its border?"}, // padding
                    {"label":"CSS",  "value":2,  "question":"What CSS property is used for changing the font?"}, //font-family
                    {"label":"CSS",  "value":3,  "question":"What CSS property is used for changing the color of text?"}, //color
                    {"label":"CSS",  "value":4,  "question":"What CSS property is used for changing the boldness of text?"}, //font-weight
                    {"label":"CSS",  "value":5,  "question":"What CSS property is used for changing the size of text?"}, //font-size
                    {"label":"CSS",  "value":6,  "question":"What CSS property is used for changing the background color of a box?"}, //background-color
                    {"label":"HTML",  "value":7,  "question":"Which word is used for specifying an HTML tag that is inside another tag?"}, //nesting
                    {"label":"CSS",  "value":8,  "question":"Which side of the box is the third number in: margin: 1px 1px 1px 1px; ?"}, //bottom
                    {"label":"CSS",  "value":9,  "question":"What are the fonts that don't have serifs at the ends of letters called?"}, //sans-serif
                    {"label":"Debts", "value":10, "question":"I'm sorry, but it's time to pay."},
                    {"label":"Taxes", "value":11, "question":"I'm sorry, but it's time to pay."},
                    {"label":"JavaScript", "value":12, "question":"What types of arrays are there?"}, //Two types: One-dimensional array and Multi-dimensional array
                    {"label":"JavaScript", "value":13, "question":"How to make a lopp?"}, //for (expression 1 (initial); expression 2(condition); expression 3(every time))
                    {"label":"JavaScript", "value":14, "question":"What types of conditionals are there?"}, //Three types: If, Else and Else if
                    {"label":"JavaScript", "value":15, "question":"What types of functions are there"}, //Two types: Fuction named and function anonymous
                    {"label":"JavaScript", "value":16, "question":"What is the difference between JavaScript and JScript?"}, //JScript is Microsoft's implementation of ECMAScript. It is available through Internet Explorer and the Windows Scripting Host. The most recent version is JScript .NET, which is based on version 4 of the ECMAScript standard (not yet finished), and can be compiled for the Microsoft .NET platform.
                    {"label":"JavaScript", "value":17, "question":"What is the difference between JavaScript and Java?"}, //Java is an OOP programming language, and it helps to create applications that function in a virtual machine or browser, while JavaScript is an OOP scripting language. Also, the JavaScript code runs on a browser only.
                    {"label":"JavaScript", "value":17, "question":"What is the difference between JavaScript and Java?"}, //
        ];
        var svg = d3.select('#chart')
            .append("svg")
            .data([data])
            .attr("width",  w + padding.left + padding.right)
            .attr("height", h + padding.top + padding.bottom);
        var container = svg.append("g")
            .attr("class", "chartholder")
            .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");
        var vis = container
            .append("g");

        var pie = d3.layout.pie().sort(null).value(function(d){return 1;});

        var arc = d3.svg.arc().outerRadius(r);

        var arcs = vis.selectAll("g.slice")
            .data(pie)
            .enter()
            .append("g")
            .attr("class", "slice");
            
        arcs.append("path")
            .attr("fill", function(d, i){ return color(i); })
            .attr("d", function (d) { return arc(d); });

        arcs.append("text").attr("transform", function(d){
                d.innerRadius = 0;
                d.outerRadius = r;
                d.angle = (d.startAngle + d.endAngle)/2;
                return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
            })
            .attr("text-anchor", "end")
            .text( function(d, i) {
                return data[i].label;
            });

        container.on("click", spin);

        
        function spin(d){
            
            container.on("click", null);
            console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
            if(oldpick.length == data.length){
                console.log("done");
                container.on("click", null);
                return;
            }
            var  ps       = 360/data.length,
                 pieslice = Math.round(1440/data.length),
                 rng      = Math.floor((Math.random() * 1440) + 360);
                
            rotation = (Math.round(rng / ps) * ps);
            
            picked = Math.round(data.length - (rotation % 360)/ps);
            picked = picked >= data.length ? (picked % data.length) : picked;
            if(oldpick.indexOf(picked) !== -1){
                d3.select(this).call(spin);
                return;
            } else {
                oldpick.push(picked);
            }
            rotation += 90 - Math.round(ps/2);
            vis.transition()
                .duration(3000)
                .attrTween("transform", rotTween)
                .each("end", function(){
                    d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                        .attr("fill", "#111");
                    d3.select("#question h1")
                        .text(data[picked].question);
                    oldrotation = rotation;
                    console.log(data[picked].value)
                    container.on("click", spin);
                });
        }

        svg.append("g")
            .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
            .append("path")
            .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
            .style({"fill":"black"});

        container.append("circle")
            .attr("cx", 0)
            .attr("cy", 0)
            .attr("r", 60)
            .style({"fill":"white","cursor":"pointer"});

        container.append("text")
            .attr("x", 0)
            .attr("y", 15)
            .attr("text-anchor", "middle")
            .text("SPIN")
            .style({"font-weight":"bold", "font-size":"30px"});
        
        function rotTween(to) {
          var i = d3.interpolate(oldrotation % 360, rotation);
          return function(t) {
            return "rotate(" + i(t) + ")";
          };
        }
        
        
        function getRandomNumbers(){
            var array = new Uint16Array(1000);
            var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
            if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
                window.crypto.getRandomValues(array);
                console.log("works");
            } else {
                for(var i=0; i < 1000; i++){
                    array[i] = Math.floor(Math.random() * 100000) + 1;
                }
            }
            return array;
        }