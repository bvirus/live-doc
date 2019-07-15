import { box, handle, freezeBox } from "./box";

export function createSource() {
    let listeners = [];
    let prev = null;

    function provide(x) {
        prev = x;
        if (listeners.length === 0) return;
        handle(listeners, x)
    }

    function listen(f) {
        listeners.push(box(null, null, f))
        let i = listeners.length - 1
        return () => { if (i < listeners.length) listeners.splice(i, 1) }
    }

    function use({ start, stop, handle }) {
        listeners.push(box(start, stop, handle))
        let i = listeners.length - 1
        return () => { if (i < listeners.length) listeners.splice(i, 1) }
    }

    return { listen, provide, use, ...freezeBox(listeners) }
}