import { makeDraggable } from './live-drag';

let defaultConfig = { 
    axis: 'y', 
    doubleClickReset: false,
    changeFactor: 3
}

export function makeDraggableNumber(store, config, render) {
    let _config = Object.assign({}, defaultConfig);
    config = Object.assign(_config, config);
    
    let drag = null;
    let stopListening = null;

    return {
        remove() {
            if (drag) drag.remove();
            if (stopListening) stopListening();
        },
        attach() {
            if (!config.disabled) 
            drag = makeDraggable(store, config);
        
            drag.attach(element);
            stopListening = store.listen(render);
            store.set(store.start);
        }
    }   
}