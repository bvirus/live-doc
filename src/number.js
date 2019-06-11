import { createSlider, sliderPercent } from './slider';
import { smoothBetween, getWindowSize } from './util';
import { makeDraggable } from './live-drag';
// import { createStore } from './store';

export function number(element, config) {
    element.classList.add('live-number');
    let slider = createSlider();

    // let destroy = store.listen(x => {
    //     slider.setWidth(sliderPercent(x, store))
    // });
    
    
    let drag = makeDraggable(element, {
        axis: config.axis,
        container: window
    });
    drag.enable();



    store.set(store.start);

    return { 
        destroy() { drag.disable(); destroy(); }, 
        set: (v) => store.set(v), 
        listen: (cb) => store.listen(cb) 
    }
}

