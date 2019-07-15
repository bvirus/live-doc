import { handle } from "./box";

export function createSource() {
    let listeners = [];
    let prev = null;

    function provide(x) {
        prev = x;
        if (listeners.length === 0) return;
        listeners.forEach(f => f(x))
    }

    function listen(f) {
        listeners = listeners.concat(f)
        let i = listeners.length - 1
        return () => { if (i < listeners.length) listeners.splice(i, 1) }
    }

    let destroy = () => {}

    return { listen, provide, destroy }
}