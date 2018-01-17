// demo.js

// This is used by demo.html to demonstrate rq.js. It include a widget function
// that represents a service requestory, a show function that is a callback
// that displays the final result, and an RQ program written as an annotated
// nested array.

/*jslint browser, es6 */

/*property
    addEventListener, appendChild, backgroundColor, createElement,
    createTextNode, fallback, getElementById, parallel, race, sequence,
    stringify, style, type, value
*/

import RQ from "./rq.js";

function widget(name) {
    return function requestor(callback, value) {
        let result = value
            ? value + ">" + name
            : name;
        let demo = document.getElementById("demo");
        let fieldset = document.createElement("fieldset");
        let legend = document.createElement("legend");
        let success = document.createElement("input");
        let failure = document.createElement("input");
        fieldset.appendChild(legend);
        fieldset.appendChild(success);
        fieldset.appendChild(failure);
        legend.appendChild(document.createTextNode(name));
        success.type = "button";
        success.value = "success";
        success.addEventListener("click", function () {
            fieldset.style.backgroundColor = "lightgreen";
            return callback(result);
        }, false);
        failure.type = "button";
        failure.value = "failure";
        failure.addEventListener("click", function () {
            fieldset.style.backgroundColor = "pink";
            return callback(undefined, result);
        }, false);
        demo.appendChild(fieldset);
        return function cancel() {
            fieldset.style.backgroundColor = "darkgray";
        };
    };
}

function show(success, failure) {
    let result;
    let title;
    let color;
    let demo = document.getElementById("demo");
    let fieldset = document.createElement("fieldset");
    let legend = document.createElement("legend");
    alert(`${success}, ${failure}`);
    if (failure === undefined) {
        result = JSON.stringify(success);
        title = "success";
        color = "lightgreen";
    } else {
        result = JSON.stringify(failure);
        title = "failure";
        color = "pink";
    }
    fieldset.appendChild(legend);
    legend.appendChild(document.createTextNode(title));
    fieldset.appendChild(document.createTextNode(result));
    fieldset.style.backgroundColor = color;
    legend.style.backgroundColor = color;
    demo.appendChild(fieldset);
}

// const a = RQ.sequence([
//     widget("Seq A1"),
//     widget("Seq A2"),
//     widget("Seq A3"),
// ]);

// console.log('sequence ret:');
// console.log(a);

// console.log('sequence ret exec ret:');
// const cancel = a(show, 'start');
// console.log(cancel);
// setTimeout(() => {
//     console.log(cancel('wo kai xin !!!'));
// }, 2000);

RQ.parallel([
    RQ.sequence([
        widget("Seq A1"),
        widget("Seq A2"),
        widget("Seq A3")
    ]),
    RQ.sequence([
        widget("Seq B1"),
        widget("Seq B2"),
        widget("Seq B3")
    ]),
    widget("C"),
    RQ.race([
        widget("Race D1"),
        widget("Race D2"),
        widget("Race D3")
    ]),
    RQ.fallback([
        widget("Fall E1"),
        widget("Fall E2"),
        widget("Fall E3")
    ])
], [
    RQ.sequence([
        widget("Opt Seq O1"),
        widget("Opt Seq O2"),
        widget("Opt Seq O3")
    ]),
    RQ.sequence([
        widget("Opt Seq P1"),
        widget("Opt Seq P2"),
        widget("Opt Seq P3")
    ]),
    widget("Opt Q"),
    RQ.race([
        widget("Opt Race R1"),
        widget("Opt Race R2"),
        widget("Opt Race R3")
    ]),
    RQ.fallback([
        widget("Opt Fall S1"),
        widget("Opt Fall S2"),
        widget("Opt Fall S3")
    ])
])(show);
