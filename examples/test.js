import * as live from '../index';
import '../default-theme.css'
import './test.css';
let $ = (...args) => document.querySelector(...args)


let firstOut = $("#first-number-out");
let first = $("#first-number");
let second = $("#second-number");
let dragOne = live.makeDraggable(first);
let dragTwo = live.makeDraggable(second);
let store = [0.1,0.5];
let range = [0,1];
function update(value, pos) {
  store[pos] = value;
  first.innerText = (55*store[0] + 3).toPrecision(2);
  second.innerText = (55*store[1] + 3).toPrecision(2);
  s.setRange(store[0], store[1])
}
// let popup = live.createPopupSlider(first);
// drag.use(popup)
dragOne.listen(v => update(Math.min(v, store[1]), 0));
dragTwo.listen(v => update(Math.max(v, store[0]), 1))
dragOne.enable();
dragTwo.enable();

let s = live.slider($("#slider"))
// let sdrag = live.makeDraggable(s);
// let range = [0.1,0.2];

function setWidth(w) {
    if (w > range[0]/2) range[1] = w;
    else range[0] = w;
    s.setRange(range[0], range[1]);
}

let command = false;
window.addEventListener('keydown', (ev) => {
  if (ev.keyCode === 224 || ev.keyCode === 17 || ev.keyCode === 16) command = true;
});

window.addEventListener('keyup', (ev) => command = false)


function makeGood(s, update) {
  let handle = null;
  return s.use({
      start: (ev) => handle = null,
      stop : (ev) => {

        if (command === true) {
          update(ev.value, 0)
          handle = 1
        }
    },
    handle : (ev) => {
      if (handle === null) {
        if (Math.abs(ev.value - store[0]) > Math.abs(ev.value - store[1])) handle = 1;
        else handle = 0
      } else if (handle === 0 && store[1] < store[0]) handle = 1
      else if (handle === 1 && store[0] > store[1]) handle=0
      update(ev.value, handle);
    },
  })
}
makeGood(s, (value, index) => update(value, index))
window.s = s
// s.listen(v => {
//   let halfway = (range[1] - range[0])*0.5 + range[0]
//   if (v > halfway) update(v, 1);
//   else update(v, 0);
// });
// drag.listen(setWidth)
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
// store.listen(n => firstOut.textContent = n)
// $("#reset-button").addEventListener("click", () => store.set(store.start));

// function sourceFromObservableSource(stream) {
//     return {
//         send: (x) => stream.next(x),
//         listen: (x) => stream.subscribe(x)
//     }
// }