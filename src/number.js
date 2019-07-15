import { createSlider, sliderPercent } from './slider';
import { smoothBetween, getWindowSize } from './util';
import { makeDraggable } from './drag';
// import { createStore } from './store';

export function number(element, config) {
    element.classList.add('live-number');
    let slider = createSlider();
    
    let drag = makeDraggable(element, {
        axis: config.axis,
        container: window
    });

    store.set(store.start);

    return Object.assign({
        set: (v) => store.set(v), 
        listen: (cb) => store.listen(cb) 
    }, drag);
}

