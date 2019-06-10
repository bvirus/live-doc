import * as live from '../index';
import '../default-theme.css'
import { ErrorHandler } from '@angular/core';
let $ = (...args) => document.querySelector(...args)

let store = live.createStore({
    range: { min: 1, max: 10 },
    start: 5,
    map: (n) => Math.floor(n)
});


let firstOut = $("#first-number-out");

let n = live.number($("#first-number"), store, {
    axis: 'x',
    format: (n) => n==0?"zero":Math.floor(n)
});

let s = live.slider($("#slider"), store, {
    name: 'slider',
    axis: 'x',
    changeFactor: 2,
    doubleClickReset: true
    // format: (n) => Math.floor(n)
})

// first.listen(n => firstOut.textContent = n <= 0 ? "n <= 0" : "n > 0")
store.listen(n => firstOut.textContent = n)
$("#reset-button").addEventListener("click", () => store.set(store.start));

function sourceFromObservableSource(stream) {
    return {
        send: (x) => stream.next(x),
        listen: (x) => stream.subscribe(x)
    }
}