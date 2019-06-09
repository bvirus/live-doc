import * as live from '../index';
import './test.css';

let $ = (...args) => document.querySelector(...args)

let store = live.makeStore({
    range: { min: 1, max: 10 },
    start: 5,
    map: (n) => Math.floor(n)
})

let firstOut = $("#first-number-out");

let destroyNumber = live.number($("#first-number"), store, {
    name: 'number',
    axis: 'x',
    changeFactor: 5,
    format: (n) => n==0?"zero":Math.floor(n)
});

let destroySlider = live.slider($("#slider"), store, {
    name: 'slider',
    axis: 'x',
    changeFactor: 2,
    doubleClickReset: true
    // format: (n) => Math.floor(n)
})
// first.listen(n => firstOut.textContent = n <= 0 ? "n <= 0" : "n > 0")
store.listen(n => firstOut.textContent = n)
$("#reset-button").addEventListener("click", () => store.set(store.start));