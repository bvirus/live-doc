import { cancelEvent, getPositionOnAxis, getBounds, clamp } from './util.js'
import { createSource } from './source.js';

export function makeDraggable(element, axis = "x", container = window) {
    // if (!config.axis) config.axis = 'y';
    // if (!config.handleStart || !config.handleMove)
    //     throw new Error("makeDraggable requires a handleMove and a handleClick function") 
    
    let source = createSource();
    let valueSource = createSource();
    source.listen(e => {
        if (e.type === 'value') valueSource.provide(e.value)
    });

    let isX = () => 'x' === axis;

    function handleStart(ev) {
        cancelEvent(ev);
        // let stop = config.handleStart(ev);
        source.provide({ type: 'start', event: ev });

        function handleMove(ev) {
            cancelEvent(ev);
            let pos = getPositionOnAxis(isX(), ev)
            let zeroPos = getBounds(isX(), element).min
            let maxPos = getBounds(isX(), container).max
            // config.handleMove((pos-zeroPos)/maxPos, ev)
            source.provide({ type: 'value', value: clamp((pos-zeroPos)/maxPos, 0, 1), event: ev });
        }

        element.classList.add('live-active')
        
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', (ev) => {
            window.removeEventListener("mousemove", handleMove);
            element.classList.remove('live-active');
            source.provide({ type: 'stop', event: ev });
        }, { once: true });

        handleMove(ev);
    }

    function disable() {
        element.removeEventListener('mousedown', handleStart);
        // if (config.handleDblClick)
        // element.removeEventListener('dblclick', handleDblClick);
        // source.destroy();
    }

    function enable() {
        element.addEventListener('mousedown', handleStart);
        element.classList.add('live')
        // element.addEventListener('dblclick', handleDblClick)
    }

    return { 
        enable, 
        disable, 
        listen: (l) => valueSource.listen(l),
        use: (l) => source.listen(l)
    }
}