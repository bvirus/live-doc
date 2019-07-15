import { cancelEvent, clamp } from './util.js'
import { createSource } from './source.js';
import { box, compose, start, handle, stop, withEvent, withClass, freezeBox, boxObject } from './box';
import { createOrientation } from './dimensions';

export function useDraggable(element, axis = "x", container = window) {
    let source = createSource()
    const ori = createOrientation(axis)

    function computeValue(ev) {
        let pos = ori.getPositionOnAxis(ev)
        let zeroPos = ori.getMin(element)
        let maxPos = ori.getMax(container)
        return { event: ev, value : clamp((pos - zeroPos) / maxPos, 0, 1) }
    }

    const dragging = [
        box(cancelEvent, cancelEvent),
        withClass(element, 'live-active'),
        withEvent(window, 'mousemove', (ev) => {
            source.handle(computeValue(ev))
        }),
        box(
            (ev) => source.start(computeValue(ev)),
            (ev) => source.stop(computeValue(ev))
        )
    ]
    
    function dragStart(ev) {
        start(dragging, ev);
        window.addEventListener('mouseup', (e) => stop(dragging, e), { once: true });
        source.handle(computeValue(ev));
    }

    let draggableTraits = [
        withEvent(element, 'mousedown', dragStart), 
        withClass(element, 'live')
    ]

    return [
        draggableTraits, 
        source
    ]
}

export function makeDraggable(element, axis = 'x', container = window) {
    const [draggable, source] = useDraggable(element, axis, container)

    return {
        ...source,
        ...freezeBox(draggable)
    }
}