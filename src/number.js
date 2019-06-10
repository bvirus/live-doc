import { createSlider, sliderPercent } from './slider';
import { smoothBetween, getWindowSize } from './util';
import { makeDraggable } from './live-drag';
// import { createStore } from './store';

export function number(element, store, config) {
    element.classList.add('live-number');
    let slider = createSlider();

    let destroy = store.listen(x => {
        slider.setWidth(sliderPercent(x, store))
    });
    
    
    let drag = makeDraggable(element, {
        handleMove(val) {
            store.set(smoothBetween(val, store.range));
            // displayPopupSlider(element, slider);
        },
        handleStart() {
            store.set(store.range.min);
            // displayPopupSlider returns a clean up function that removes the popup
            // slider. handleStart can return a clean up function as well, so
            // we just pass through
            slider.displayNear(element);
            document.body.appendChild(slider.container)
            return () => { document.body.removeChild(slider.container) }
        },
        axis: config.axis,
        container: window
    });
    drag.enable();

    store.listen((v) => {
        if (config.format) v = config.format(v);
        element.textContent = v;
    });

    store.set(store.start);

    return { 
        destroy() { drag.disable(); destroy(); }, 
        set: (v) => store.set(v), 
        listen: (cb) => store.listen(cb) 
    }
}

