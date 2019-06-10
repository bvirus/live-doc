import { clamp } from './util';
import { number } from './number';
import { slider } from './slider';

const errMessage = `
must provide a config object, with range to makeStore!
Example: makeStore({ range: { min: 0, max: 10 } })`;

export function makeStore(config) {
    let hasPrev = false;
    let prev = null;
    if (!config || !config.range || !config.range.min || !config.range.max) 
        throw new Error(errMessage);

    let frameId = null;
    let listeners = [];

    function set(x) {
        if (frameId !== null) cancelAnimationFrame(frameId);
        if (listeners.length === 0) return;
        if (hasPrev && x == prev) return;

        x = clamp(x, config.range.min, config.range.max);

        frameId = requestAnimationFrame(() => {
            frameId = null;
            listeners.forEach(l => config.map ? l(config.map(x)) : l(x));
        });
    }

    function listen(f) {
        listeners.push(f);
        return () => { listeners = listeners.filter(x => x !== f) }
    }

    let destroy = () => cancelAnimationFrame(frameId);
    if (!config.start) config.start = config.range.min

    return {
        set,
        listen, 
        range: config.range, 
        start: config.start, 
        destroy
    }
}
