import { cancelEvent, clamp } from './util.js'
import { trait, fromTraits, withEvent, withClass } from './traits';
import { createOrientation } from './dimensions';

export function withDraggable(sendEvent, element, axis = "x", container = window) {
    const ori = createOrientation(axis)

    function computeValue(ev) {
        cancelEvent(ev)
        let pos = ori.getPositionOnAxis(ev)
        let zeroPos = ori.getMin(element)
        let maxPos = ori.getMax(container)
        return { event: ev, value : clamp((pos - zeroPos) / maxPos, 0, 1) }
    }

    const dragging = fromTraits([
        trait(cancelEvent, cancelEvent),
        withClass(element, 'live-active'),
        withEvent(window, 'mousemove', (ev) => {
            sendEvent({ type : 'move', ...computeValue(ev) })
        }),
        Object.freeze({
            start: (ev) =>  sendEvent({ type : 'start', ...computeValue(ev) }),
            stop: (ev) =>   sendEvent({ type: 'stop', ...computeValue(ev) })
        })
    ])
    
    function dragStart(ev) {
        dragging.start(ev);
        window.addEventListener('mouseup', (e) => dragging.stop(e), { once: true });
    }

    return fromTraits([
        withEvent(element, 'mousedown', dragStart), 
        withClass(element, 'live')
    ])
}

export const makeDraggable = withDraggable