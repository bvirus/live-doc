import { cancelEvent, clamp } from './util.js'
import { createSource } from './source.js';
import { box, compose, start, handle, stop, withEvent, withClass, freezeBox } from './box';
import { createOrientation } from './dimensions';

export function useDraggable(element, axis = "x", container = window) {
    let listeners = [];
    const ori = createOrientation(axis)


    function computeValue(ev) {
        let pos = ori.getPositionOnAxis(ev)
        let zeroPos = ori.getMin(element)
        let maxPos = ori.getMax(container)
        return { event: ev, value : clamp((pos - zeroPos) / maxPos, 0, 1) }
    }

    const dragging = compose(
        box(cancelEvent, cancelEvent),
        withClass(element, 'live-active'),
        withEvent(window, 'mousemove', (ev) => {

            handle(listeners, computeValue(ev))
        }),
        box(
            (ev) => start(listeners, computeValue(ev)),
            (ev) => stop(listeners, computeValue(ev))
        )
    )
    
    function dragStart(ev) {
        start(dragging, ev);
        window.addEventListener('mouseup', (e) => stop(dragging, e), { once: true });
        handle(listeners, computeValue(ev));
    }

    return [
        compose( 
            withEvent(element, 'mousedown', dragStart), 
            withClass(element, 'live')
        ), 
        (f) => { listeners = listeners.concat(box(null,null,f)) },
        ({start, stop, handle}) => listeners = listeners.concat(box(start, stop, handle))
    ]
}

export function makeDraggable(element, axis = 'x', container = window) {
    const [draggable, listen, use] = useDraggable(element, axis, container)

    return {
        listen: listen,
        use: use,
        ...freezeBox(draggable)
    }
}