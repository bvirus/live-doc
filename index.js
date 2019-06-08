import { clamp, smoothstep, smoothBetween } from './math-util.js'

export function text(element) {

}

let defaultConfig = { 
    axis: 'y', 
    inital: 0, 
    doubleClickReset: true,
    changeFactor: 2,
    format: (n) => n.toPrecision(4)
}

export function number(element, 
        config) {
    config = Object.assign(defaultConfig, config)
    let listeners = [(v) => element.textContent = config.format(v) ];
    let frameId = null;
    let windowSize = 
        ('x' === config.axis) ? window.innerWidth : window.innerHeight;
    // if (config.range) config.changeFactor = distance(config.range.min, config.range.max,)
    function positionOnAxis(el) {
        return ('x' === config.axis) ? el.clientX : el.clientY;
    }

    function listen(f) {
        listeners.push(f);
        return () => { listeners = listeners.filter(x => x !== f) }
    }

    function set(x) {
        if (frameId !== null) cancelAnimationFrame(frameId)
        if (listeners.length === 0) return;

        frameId = requestAnimationFrame(() => {
            frameId = null;
            listeners.forEach(l => l(x))
        });
    }

    function calcValue(diff) {
        if (config.hasOwnProperty("range")) {
            return smoothBetween(diff, config.range)
        } else return diff;
    }

    function handleStart(ev) {
        ev.preventDefault()
        ev.stopPropagation()
        let zeroPos = positionOnAxis(ev)
        let maxPos = windowSize/config.changeFactor
        element.classList.add('live-number-active')
        function handleMove(ev) {
            let pos = positionOnAxis(ev)
            set(calcValue((pos-zeroPos)/maxPos))
        }
        let handler = window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', () => {
            window.removeEventListener("mousemove", handleMove);
            element.classList.remove('live-number-active');
        });
    }

    function handleDblClick() {
        set(config.inital)
    }

    function destroy() {
        cancelAnimationFrame(frameId);
        window.removeEventListener('mousedown', handleStart);
        if (config.doubleClickReset)
            element.removeEventListener('dblclick', handleDblClick);
    }

    element.addEventListener('mousedown', handleStart);
    element.classList.add('live-number')
    if (config.doubleClickReset)
        element.addEventListener('dblclick', handleDblClick)
    set(config.inital);

    let ob = { listen, set, destroy }
    return ob
}