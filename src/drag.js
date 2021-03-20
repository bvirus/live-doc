import { cancelEvent, clamp } from './util.js'
import { fromTraits, withEvent, withClass, withAttribute } from './traits';
import { Orientation } from './dimensions';

export function withDraggable(sendEvent, element, axis = "x", container = window) {
    const ori = new Orientation(axis)

    function computeValue(ev) {
        let pos = ori.getPositionOnAxis(ev)
        let zeroPos = ori.getMin(element)
        let maxPos = ori.getMax(container)
        return { event: ev, value : clamp((pos - zeroPos) / maxPos, 0, 1) }
    }

    const sendMove = (ev) => { 
        cancelEvent(ev); 
        sendEvent({ type : 'move', ...computeValue(ev) }); 
    };

    const startDragging = fromTraits([
        cancelEvent,
        withClass(element, 'live-active'),
        withEvent(window, 'mousemove', sendMove),
        // withEvent(window, 'touchmove', sendMove),
        (ev) => {
            sendEvent({ type : 'start', ...computeValue(ev) });
            return (ev) => {
                sendEvent({ type: 'stop', ...computeValue(ev) })
            }
        }
    ])
    
    function dragStart(ev) {
        const stop = startDragging(ev);
        window.addEventListener('mouseup', stop, { once: true });
        // window.addEventListener('touchend', stop, { once: true });
    }

    return fromTraits([
        withEvent(element, 'mousedown', dragStart),
        // withEvent(element, 'touchstart', dragStart),
        // withAttribute(element, 'draggable', 'true'),
        withClass(element, 'live')
    ])
}

export const makeDraggable = (...args) => {
    const start = withDraggable(...args);
    return { start };
}
