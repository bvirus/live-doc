import { distance, smoothBetween } from './util';
import { useDraggable } from './drag';
import { dimensions } from './dimensions';
import { compose, withChild, withClass, freezeBox, withEvent } from './box';
import { createSource } from './source';

export function sliderPercent(v, store) {
    return (distance(v, store.range.min) / distance(store.range.min, store.range.max))
}

export function slider(element) {
    const slider = createSlider();
    const [draggable, source] = useDraggable(element, 'x', element);
    
    const sliderTraits = [
        ...draggable,
        withClass(element, '_live_group'), // add clearfix hack
        withChild(element, slider.container)
    ]

    return {
        ...freezeBox(sliderTraits),
        listen: source.listen,
        use : source.use,
        ...slider
    }
}

export function rangeSlider(element, store = [0,0]) {
    const slider = createSlider();
    const [draggable, _source] = useDraggable(element, 'x', element);
    const source = createSource()
    const sliderTraits = [
        ...draggable,
        withEvent(window, 'keydown', (ev) => {
            if (ev.keyCode === 224 || ev.keyCode === 17 || ev.keyCode === 16) command = true;
        }),
        withEvent(window, 'keyup', () => command = false),
        withClass(element, '_live_group'), // add clearfix hack
        withChild(element, slider.container)
    ]
    let command = false;
    let handle = null;

    const smarts = {
        start: ({ value }) => {
            if (command === true) {
                source.start([value, 0])
                handle = 1
            }
        },
        stop: ({ value }) => handle = source.stop([value, handle]),
        handle: ({ value }) => {
            if (handle === null) {
                if (Math.abs(value - store[0]) > Math.abs(value - store[1])) handle = 1;
                else handle = 0
            } else if (handle === 0 && store[1] < store[0]) handle = 1
            else if (handle === 1 && store[0] > store[1]) handle = 0
            source.handle([value, handle]);
        },
    }

    _source.use(smarts)

    return {
        ...freezeBox(sliderTraits),
        listen: source.listen,
        use : source.use,
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
    function setRange(x, y) {
        fill.style[primary.position.start] = x * 100 + "%";
        fill.style[primary.position.end] = ((1 - y) * 100 + "%");
    }
    return { container, setFill, setRange };
}


export function createPopupSlider(element, axis) {
    let slider = createSlider(axis);

    return (event) => {
        switch (event.type) {
            case 'start':
                slider.displayNear(event.event.target);
                document.body.appendChild(slider.container);
                break;
            case 'stop':
                document.body.removeChild(slider.container);
                break;
            case 'value':
                slider.set(event.value);
                break;
        }
    }
}

// export function createPopupSlider(element) {
//     let slider = createSlider();
//     function mousedown(ev) {
//         slider.displayNear(ev.target);
//         document.body.appendChild(slider.container);

//         window.addEventListener('mouseup', () => {
//             document.body.removeChild(slider.container);
//         }, { once: true });
//     }

//     return {
//         enable: () => element.addEventListener('mousedown', mousedown),
//         disable: () => element.removeEventListener('mousedown', mousedown),
//         setWidth: (w) => slider.setWidth(w)
//     }
// }