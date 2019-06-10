import { cancelEvent, getPositionOnAxis, getBounds } from './util.js'

export function makeDraggable(element, config) {
    if (!config.axis) config.axis = 'y';
    if (!config.handleStart || !config.handleMove)
        throw new Error("makeDraggable requires a handleMove and a handleClick function") 

    let isX = () => ('x' === config.axis);

    function handleStart(ev) {
        cancelEvent(ev);
        let stop = config.handleStart();

        function handleMove(ev) {
            cancelEvent(ev);
            let pos = getPositionOnAxis(isX(), ev)
            let zeroPos = getBounds(isX(), element).min
            let maxPos = getBounds(isX(), config.container).max
            config.handleMove((pos-zeroPos)/maxPos)
        }

        element.classList.add('live-active')
        
        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', () => {
            window.removeEventListener("mousemove", handleMove);
            element.classList.remove('live-active');
            if (stop) stop();
        }, { once: true });

        handleMove(ev);
    }

    function handleDblClick() {
        config.handleDblClick();
    }

    function disable() {
        element.removeEventListener('mousedown', handleStart);
        if (config.handleDblClick)
            element.removeEventListener('dblclick', handleDblClick);
    }

    function enable() {
        element.addEventListener('mousedown', handleStart);
        element.classList.add('live')
        if (config.handleDblClick)
            element.addEventListener('dblclick', handleDblClick)
    }

    return { enable, disable };
}