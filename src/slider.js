import { distance, smoothBetween } from './util';
import { makeDraggable } from './live-drag';

export function sliderPercent(v, store) {
    return (distance(v, store.range.min)/distance(store.range.min, store.range.max))
}

export function slider(element, store, config) {
    let { container, setWidth } = createSlider();
    element.classList.add('_live_group'); // add clearfix hack
    element.appendChild(container)

    let drag = makeDraggable(element, {
        handleMove(val) {
            store.set(smoothBetween(val, store.range));
        },
        handleStart() {
            store.set(store.range.min);
        },
        axis: config.axis,
        container: element
    });
    drag.enable();
    
    store.listen((v) => {
        if (config.format) v = config.format(v)
        let amount = sliderPercent(v, store)
        setWidth(amount)
    });
    store.set(store.start);

    return () => {
        drag.disable();
        element.removeChild(container);
    }
}

export function createSlider(axis) {
    let container = document.createElement('div');
    container.classList.add('live-slider')
    Object.assign(container.style, {
        position: "relative",
        display: "inline-block",
        width: "100%",
        minHeight: "10px"
    })

    let background = document.createElement("span");
    
    background.classList.add('live-slider-background')
    Object.assign(background.style, {
        position: "absolute",
        width: "100%",
        height: "100%",
        left: "0",
        top: "0"
    })

    let fill = document.createElement("span");
    fill.classList.add('live-slider-fill')
    Object.assign(fill.style, {
        height: "100%",
        float: "left"   // don't use left, or top, properties here
                        // we need relative positioning
    })
    
    background.appendChild(fill)
    container.appendChild(background);

    function displayNear(element) {
        let rect = element.getBoundingClientRect();
        // let top = Math.max(getWindowSize(axis === 'x').min, rect.top + rect.height + 5)
        Object.assign(container.style, {
            position: 'absolute',
            top: rect.top + rect.height + 5 + "px",
            left: (rect.left + rect.width/2 - (50)) + "px",
            width: "100px" // make dynamic
        });
    }
    function setWidth(x) {
        fill.style.width = (x*100 + "%")
    }
    return { container, setWidth, displayNear };
}