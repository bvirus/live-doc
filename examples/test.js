import * as live from '../index';
import '../default-theme.css'
import './test.css';
let $ = (...args) => document.querySelector(...args)

let firstOut = $("#first-number-out");
let first = $("#first-number");
let second = $("#second-number");
const updater = (i) => ({ value }) => update(Math.min(value, store[1]), 0)
let dragOne = live.makeDraggable(
  ({value}) => update(Math.min(value, store[1]), 0), first);
let dragTwo = live.makeDraggable((
  {value}) => update(Math.max(value, store[0]), 1), second);
let store = [0.1, 0.5];
let range = [0, 1];
 
function update(value, pos) {
  store[pos] = value;
  display(store)
}
function display(x) {
  first.innerText = (55 * x[0] + 3).toPrecision(2);
  second.innerText = (55 * x[1] + 3).toPrecision(2);
  s.setRange(x)
}
// let popup = live.createPopupSlider(first);
// drag.use(popup)
dragOne.start();
dragTwo.start();

let s = live.rangeSlider($("#slider"), (ev) => {
  store = ev.updateRange(store)
  display(store)
})
// let sdrag = live.makeDraggable(s);
// let range = [0.1,0.2];
// s.listen(v => {
//   let halfway = (range[1] - range[0])*0.5 + range[0]
//   if (v > halfway) update(v, 1);
//   else update(v, 0);
// });
// drag.listen(setWidth)
s.start();
let prev = null


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
// store.listen(n => firstOut.textContent = n)
// $("#reset-button").addEventListener("click", () => store.set(store.start));

// function sourceFromObservableSource(stream) {
//     return {
//         send: (x) => stream.next(x),
//         listen: (x) => stream.subscribe(x)
//     }
// }


// function Test(props) {
//   let [range, setRange] = useState([0.1, 0.2])
//   function handleSlide(ev) {
//     let n = next(range, ev)
//     setState(n)
//   }
//   return <slider range={range} onSlide={handleSlide} />
// }