import * as live from '../index';
import '../default-theme.css'
import './test.css';
let $ = (...args) => document.querySelector(...args)

let firstOut = $("#first-number-out");
let first = $("#first-number");
let second = $("#second-number");

let store = [0.1, 0.5];
 
function update(value, pos) {
  store[pos] = value;
  display(store)
}
function display(x) {
  first.innerText = (55 * x[0] + 3).toPrecision(2);
  second.innerText = (55 * x[1] + 3).toPrecision(2);
  s.setRange(x)
}


let dragOne = live.makeDraggable(
  ({value}) => update(Math.min(value, store[1]), 0), first);

let dragTwo = live.makeDraggable((
  {value}) => update(Math.max(value, store[0]), 1), second);


dragOne.start();
dragTwo.start();

let s = live.rangeSlider($("#slider"), (ev) => {
  store = ev.nextRange(store)
  display(store)
})

s.start();