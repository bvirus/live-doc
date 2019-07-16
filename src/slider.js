import { distance, smoothBetween } from './util';
import { withDraggable } from './drag';
import { dimensions } from './dimensions';
import { withChild, withClass, fromTraits, withEvent } from './traits';

export function slider(element, sendEvent) {
    const slider = createSlider();
    return {
        ...fromTraits([
            withDraggable(sendEvent, element, 'x', element),
            withClass(element, '_live_group'), // add clearfix hack
            withChild(element, slider.container)
        ]),
        ...slider
    }
}

export function rangeSlider(element, sendEvent) {
    const slider = createSlider();
    let command = false;
    let handle = null
    function next(value, store) {
        if (handle === 0 && store[1] < value) handle = 1
        else if (handle === 1 && store[0] > value) handle = 0
        let ret = store.slice()
        ret[handle] = value
        return ret
    }
    function nextRange(store, draw = false) {
        switch (this.type) {
            case 'start':
                if (command || draw) {
                    handle = 1
                    return [this.value, this.value]
                }
                handle = 0
                if (Math.abs(this.value - store[0]) > Math.abs(this.value - store[1])) 
                    handle = 1;
                return next(this.value, store)
            case 'move': return next(this.value, store)
            case 'stop': return next(this.value, store)
            default : return next(this.value, store)
        }
    }
    
    const sliderTraits = fromTraits([
        withDraggable((ev) => {
            command = ev.event.ctrlKey || ev.event.shiftKey || ev.event.metaKey || ev.event.button === 2
            ev.nextRange = nextRange.bind(ev)
            sendEvent(ev)
        }, element, 'x', element),
        withEvent(window, 'mouseup', () => command = false),
        withEvent(element, 'contextmenu', (ev) => ev.preventDefault()),
        withClass(element, '_live_group'), // add clearfix hack
        withChild(element, slider.container)
    ])

    return {
        ...sliderTraits,
        ...slider
    }
}

export function createSlider(axis = 'x') {
    let container = document.createElement('div');
    container.classList.add('live-slider')
    let { primary, secondary } = dimensions[axis]

    Object.assign(container.style, {
        position: "relative",
        display: "inline-block",
        [primary.dimension]: "100%",
        minHeight: "10px"
    })

    // let backgroundBoundary = createBoundary(container, axis)
    let background = document.createElement("span");
    background.classList.add('live-slider-background')
    Object.assign(background.style, {
        position: "absolute",
        [primary.dimension]: "100%",
        [secondary.dimension]: "100%",
    })
    // backgroundBoundary.setPrimary(0,0)

    let fill = document.createElement("span");

    fill.classList.add('live-slider-fill')

    Object.assign(fill.style, {
        position: 'absolute',
        [secondary.dimension]: "100%",
        [primary.position.start]: 0,
        [secondary.position.start]: 0
    })

    background.appendChild(fill)
    container.appendChild(background);

    function setFill(x) {
        fill.style[primary.position.end] = (x * 100 + "%")
        fill.style[primary.position.start] = "0%";
        fill.style[secondary.dimension] = container[secondary.client] + "px"
    }
    function setRange([x, y]) {
        fill.style[primary.position.start] = x * 100 + "%";
        fill.style[primary.position.end] = ((1 - y) * 100 + "%");
    }
    return { container, setFill, setRange };
}