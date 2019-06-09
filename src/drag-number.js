import { makeDraggable } from './live-drag';

let defaultConfig = { 
    axis: 'y', 
    doubleClickReset: false,
    changeFactor: 3
}

export function makeDraggableNumber(element, store, config, render) {
    let _config = Object.assign({}, defaultConfig);
    config = Object.assign(_config, config);

    let destroyDrag = () => {};
    if (!config.disabled) 
        destroyDrag = makeDraggable(element, store, config, render);
    
    let stopListening = store.listen(render);
    store.set(store.start);

    return () => {
        destroyDrag();
        stopListening();
    };
}