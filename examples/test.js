import * as live from '../index.js';
import './test.css';

let $ = (...args) => document.querySelector(...args)
let firstOut = $("#first-number-out");

let first = live.number($("#first-number"), {
    range: { min: -100, max: 100 },
    inital: 0
});

first.listen(n => firstOut.textContent = n.toString())

$("#reset-button").addEventListener("click", () => first.set(0));