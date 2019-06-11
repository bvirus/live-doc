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
let first = $("#first-number");
let drag = live.makeDraggable(first);
let popup = live.createPopupSlider(first);
drag.use(popup)
drag.listen(v => first.textContent = Math.floor(55*v + 3) );
first.textContent = "3";
drag.enable();

let s = live.slider($("#slider"))
function setWidth(w) {
    s.setWidth(w)
}
s.listen(setWidth);
drag.listen(setWidth)
s.enable();

/*
"refactored API. It's significantly simpler -- no need for a store, just .listen and (for sliders) .setWidth). I would like to add something so that you can listen for all events (mousedown, mousemove, mouseup) or just the value events"
*/

// let n = live.number($("#first-number"), {
//     axis: 'x',
//     format: (n) => n==0?"zero":Math.floor(n)
// });

// store.listen((v) => {
//     // if (config.format) v = config.format(v);
//     $("#first-number").textContent = v;
// });

// let s = live.slider($("#slider"), store, {
//     name: 'slider',
//     axis: 'x',
//     changeFactor: 2,
//     doubleClickReset: true
//     // format: (n) => Math.floor(n)
// })

// first.listen(n => firstOut.textContent = n <= 0 ? "n <= 0" : "n > 0")
store.listen(n => firstOut.textContent = n)
// $("#reset-button").addEventListener("click", () => store.set(store.start));

// function sourceFromObservableSource(stream) {
//     return {
//         send: (x) => stream.next(x),
//         listen: (x) => stream.subscribe(x)
//     }
// }