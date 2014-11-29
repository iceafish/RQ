// demo.js

// This is used by demo.html to demonstrate rq.js. It include a WIDGET function
// that represents a service requestory, a SHOW function that is a requestion
// that displays the final result, and an RQ program written as an annotated
// nested array.

/*global document, RQ */

function WIDGET(name) {
    'use strict';
    return function requestor(requestion, value) {
        var result = value ? value + '>' + name : name,
            demo = document.getElementById("demo"),
            fieldset = document.createElement("fieldset"),
            legend = document.createElement("legend"),
            success = document.createElement("input"),
            failure = document.createElement("input");
        fieldset.appendChild(legend);
        fieldset.appendChild(success);
        fieldset.appendChild(failure);
        legend.appendChild(document.createTextNode(name));
        success.type = "button";
        success.value = "success";
        success.addEventListener("click", function () {
            fieldset.style.backgroundColor = "lightgreen";
            return requestion(result);
        }, false);
        failure.type = "button";
        failure.value = "failure";
        failure.addEventListener("click", function () {
            fieldset.style.backgroundColor = "pink";
            return requestion(undefined, result);
        }, false);
        demo.appendChild(fieldset);
        return function quash() {
            fieldset.style.backgroundColor = "darkgray";
        };
    };
}

function SHOW(success, failure) {
    'use strict';
    var result,
        title,
        color,
        demo = document.getElementById("demo"),
        fieldset = document.createElement("fieldset"),
        legend = document.createElement("legend");
    if (failure === undefined) {
        result = String(success);
        title = "success";
        color = "lightgreen";
    } else {
        result = String(failure);
        title = "failure";
        color = "pink";
    }
    fieldset.appendChild(legend);
    legend.appendChild(document.createTextNode(title));
    fieldset.appendChild(document.createTextNode(JSON.stringify(result)));
    fieldset.style.backgroundColor = color;
    legend.style.backgroundColor = color;
    demo.appendChild(fieldset);
}

RQ.parallel([
    RQ.sequence([
        WIDGET('Seq A1'),
        WIDGET('Seq A2'),
        WIDGET('Seq A3')
    ]),
    RQ.sequence([
        WIDGET('Seq B1'),
        WIDGET('Seq B2'),
        WIDGET('Seq B3')
    ]),
    WIDGET('C'),
    RQ.race([
        WIDGET('Race D1'),
        WIDGET('Race D2'),
        WIDGET('Race D3')
    ]),
    RQ.fallback([
        WIDGET('Fall E1'),
        WIDGET('Fall E2'),
        WIDGET('Fall E3')
    ])
], [
    RQ.sequence([
        WIDGET('Opt Seq O1'),
        WIDGET('Opt Seq O2'),
        WIDGET('Opt Seq O3')
    ]),
    RQ.sequence([
        WIDGET('Opt Seq P1'),
        WIDGET('Opt Seq P2'),
        WIDGET('Opt Seq P3')
    ]),
    WIDGET('Opt Q'),
    RQ.race([
        WIDGET('Opt Race R1'),
        WIDGET('Opt Race R2'),
        WIDGET('Opt Race R3')
    ]),
    RQ.fallback([
        WIDGET('Opt Fall S1'),
        WIDGET('Opt Fall S2'),
        WIDGET('Opt Fall S3')
    ])
])(SHOW);
