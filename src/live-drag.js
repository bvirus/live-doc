import { smoothBetween, cancelEvent, getPositionOnAxis, getBounds } from './util.js'

export function makeDraggable(element, store, config) {
    if (!config.axis) config.axis = 'y';
    let isX = () => ('x' === config.axis);

    function handleStart(ev) {
        cancelEvent(ev);

        function handleMove(ev) {
            cancelEvent(ev);
            let pos = getPositionOnAxis(isX(), ev)
            let zeroPos = getBounds(isX(), element).min
            let maxPos = getBounds(isX(), config.container).max
            let val = smoothBetween((pos-zeroPos)/maxPos, store.range);
            store.set(val);
        }

        element.classList.add('live-active')
        store.set(store.range.min)
        
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', () => {
            window.removeEventListener("mousemove", handleMove);
            element.classList.remove('live-active');
        }, { once: true });

        handleMove(ev);
    }

    function handleDblClick() {
        store.set(store.start)
    }

    function destroy() {
        element.removeEventListener('mousedown', handleStart);
        if (config.doubleClickReset)
            element.removeEventListener('dblclick', handleDblClick);
    }
    
    element.addEventListener('mousedown', handleStart);
    element.classList.add('live')
    if (config.doubleClickReset)
        element.addEventListener('dblclick', handleDblClick)

    return destroy;
}