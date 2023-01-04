document.addEventListener("DOMContentLoaded", function (event) {
    document.querySelector("body").style.opacity = 1;
});
let ramdomObject = 0;
var padding = { top: 20, right: 100, bottom: 0, left: 0 },
    w = 1000 - padding.left - padding.right,
    h = 1000 - padding.top - padding.bottom,
    r = Math.min(w, h) / 2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20();

function changeColor(newColor) {
    var elem = document.getElementById('para');
    elem.style.color = newColor;
}

/* 
<p id="para">Responde Verdadero o Falso</p>
<button id="True" onclick="changeColor('blue');">Verdadero</button>
<button id="False" onclick="changeColor('red');">Falso</button>
 */

var data = [
    {
        label: "CSS",
        value: 1,
        question:
            "Una hoja de estilo es un fichero de texto plano (sin formato) en el que se define el aspecto de las etiquetas de una página web",
        answer: true

    },
    {
        label: "CSS",
        value: 2,
        question: "Una hoja de estilo está formada por una o varias sentencias",
        answer: true
    },
    {
        label: "CSS",
        value: 3,
        question: "Existen dos tipos de sentencias: las reglas y las no reglas",
        answer: false
    },
    {
        label: "CSS",
        value: 4,
        question: "Algunas reglas-arroba deben aparecer al principio de la hoja de estilo",
        answer: true
    },
    {
        label: "HTML",
        value: 5,
        question:
            "El carácter < (menor que) sólo puede utilizarse para indicar el comienzo de una etiqueta",
        answer: true
    }, //nesting
    {
        label: "HTML",
        value: 6,
        question:
            "El nombre del elemento en la etiqueta de cierre no tiene que coincidir con el nombre en la etiqueta de apertura",
        answer: false
    },
    {
        label: "CSS",
        value: 7,
        question:
            "Se recomienda en las sentencias dejar un espacio en blanco entre el selector y la llave",
        answer: true
    },
    {
        label: "JavaScript",
        value: 8,
        question: "JavaScript no distingue entre mayúsculas y minúsculas",
        answer: false
    },
    {
        label: "JavaScript",
        value: 9,
        question: "En JavaScript, las instrucciones se denominan declaraciones y están separadas por punto y coma (;)",
        answer: true
    },
    {
        label: "JavaScript",
        value: 10,
        question: "El texto fuente del script JavaScript se escanea de abajo a arriba",
        answer: false
    },
    {
        label: "F5",
        value: 11,
        question: "¿Es Diego un PROFESOR?",
        answer: false
        //Es un FACILITADOR
    },
    {
        label: "JavaScript",
        value: 12,
        question: "Cuando declaras una variable fuera de cualquier función, se denomina variable global",
        answer: true
    },
    {
        label: "JavaScript",
        value: 13,
        question: "Las matrices se construyen con bigotes, que contiene una lista de elementos separdos por puntos",
        answer: false
    },
    {
        label: "JavaScript",
        value: 14,
        question: "Puedes declarar una constante con el mismo nombre que una función o una variable en el mismo ámbito.",
        answer: false
    }, //No puedes
];

var svg = d3
    .select("#chart")
    .append("svg")
    .data([data])
    .attr("width", w + padding.left + padding.right)
    .attr("height", h + padding.top + padding.bottom);
var container = svg
    .append("g")
    .attr("class", "chartholder")
    .attr(
        "transform",
        "translate(" + (w / 2 + padding.left) + "," + (h / 2 + padding.top) + ")"
    );
var vis = container.append("g");
var pie = d3.layout
    .pie()
    .sort(null)
    .value(function (d) {
        return 1;
    });
var arc = d3.svg.arc().outerRadius(r);

var arcs = vis
    .selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");
arcs
    .append("path")
    .attr("fill", function (d, i) {
        return color(i);
    })
    .attr("d", function (d) {
        return arc(d);
    });
arcs
    .append("text")
    .attr("transform", function (d) {
        d.innerRadius = 0;
        d.outerRadius = r;
        d.angle = (d.startAngle + d.endAngle) / 2;
        return (
            "rotate(" +
            ((d.angle * 180) / Math.PI - 90) +
            ")translate(" +
            (d.outerRadius - 10) +
            ")"
        );
    })
    .attr("text-anchor", "end")
    .text(function (d, i) {
        return data[i].label;
    });

var arcs = vis.selectAll("g.slice")
    .data(pie)
    .enter()
    .append("g")
    .attr("class", "slice");

arcs.append("path")
    .attr("fill", function (d, i) { return color(i); })
    .attr("d", function (d) { return arc(d); });

arcs.append("text").attr("transform", function (d) {
    d.innerRadius = 0;
    d.outerRadius = r;
    d.angle = (d.startAngle + d.endAngle) / 2;
    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius - 10) + ")";
})
    .attr("text-anchor", "end")
    .text(function (d, i) {
        return data[i].label;
    }
    )

container.on("click", spin);

function spin() {
    container.on("click", null);
    console.log("Data length: " + data.length);

    var positionSpinDegrees = 360 / data.length,

        rng = Math.floor(Math.random() * 1440 + 360);
    rotation = Math.round(rng / positionSpinDegrees) * positionSpinDegrees;
    picked = Math.round(data.length - (rotation % 360) / positionSpinDegrees);
    picked = picked >= data.length ? picked % data.length : picked;
    if (oldpick.indexOf(picked) !== -1) {
        d3.select(this).call(spin);
        return;
    } else {
        oldpick.push(picked);
    }
    rotation += 90 - Math.round(positionSpinDegrees / 2);
    vis
        .transition()
        .duration(3000)
        .attrTween("transform", rotTween)
        .each("end", function () {
            d3.select(".slice:nth-child(" + (picked + 1) + ") path").attr(
                "fill",
                "#111"
            );
            d3.select("#question h1").text(data[picked].question);

            let questionContainer = document.querySelector('#question-btn')
            questionContainer.innerHTML = `
                <button class="btn-true" onclick="checkUserDecision(true,${picked})">true</button>
                <button class="btn-false" onclick="checkUserDecision(false,${picked})">false</button>
                `


            //asignar a los button el evento que queremos



            oldrotation = rotation;
            ramdomObject = data[picked].value
            console.info("este sera mi objeto ramdom " + ramdomObject)
            console.log("value " + data[picked].value);
            container.on("click", spin);
        });
}
svg
    .append("g")
    .attr(
        "transform",
        "translate(" +
        (w + padding.left + padding.right) +
        "," +
        (h / 2 + padding.top) +
        ")"
    )
    .append("path")
    .attr("d", "M-" + r * 0.15 + ",0L0," + r * 0.05 + "L0,-" + r * 0.05 + "Z")
    .style({ fill: "black" });
container
    .append("circle")
    .attr("cx", 0)
    .attr("cy", 0)
    .attr("r", 60)
    .style({ fill: "white", cursor: "pointer" });
container
    .append("text")
    .attr("x", 0)
    .attr("y", 15)
    .attr("text-anchor", "middle")
    .text("SPIN")
    .style({ "font-weight": "bold", "font-size": "30px" });

function rotTween() {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function (t) {
        return "rotate(" + i(t) + ")";
    };
}

function checkUserDecision(decision, question) {
   
    if (decision === data[question].answer) {
        console.log("Congrats!! it´s the right answer");
        changeColor("green");
        disabledBtnValidation();
        return ;
    }

    console.log("Sorry!! it´s the wrong answer");
    changeColor("red");
    disabledBtnValidation();
} 

function disabledBtnValidation() {
    let btnTrue = document.querySelector(".btn-true")
    let btnFalse = document.querySelector(".btn-false")
    btnTrue.disabled = true;
    btnFalse.disabled = true;
}
    // recuperar el objeto que Ñha salido (texto)
    
    //console.log (decision)