import { makeDraggableNumber } from './drag-number';
import { distance } from './util';

export function sliderPercent(v, store) {
    return (distance(v, store.range.min)/distance(store.range.min, store.range.max))
}

export function slider(element, store, config) {
    let { container, setWidth } = createSlider();
    element.classList.add('_live_group'); // add clearfix hack
    element.appendChild(container)
    config.container = element;

    let destroy = makeDraggableNumber(element, store, config, (v) => {
        if (config.format) v = config.format(v)
        let amount = sliderPercent(v, store)
        setWidth(amount)
    })

    return () => {
        destroy();
        element.removeChild(container);
    }
}

export function createSlider() {
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
        backgroundColor: "#DDD",
        left: "0",
        top: "0"
    })

    let fill = document.createElement("span");
    fill.classList.add('live-slider-fill')
    Object.assign(fill.style, {
        height: "100%",
        backgroundColor: "blue",
        float: "left"   // don't use left, or top, properties here
                        // we need relative positioning
    })
    
    background.appendChild(fill)
    container.appendChild(background);
    return { container, setWidth(x) { fill.style.width = (x*100 + "%")} };
}