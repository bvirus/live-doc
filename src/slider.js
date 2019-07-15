import { distance, smoothBetween } from './util';
import { useDraggable } from './live-drag';
import { dimensions } from './dimensions';
import { compose, withChild, withClass, freezeBox } from './box';

export function sliderPercent(v, store) {
    return (distance(v, store.range.min)/distance(store.range.min, store.range.max))
}

export function slider(element) {
    let slider = createSlider();
    let [draggable, listen, use] = useDraggable(element,'x', element);
    let sliderBox = compose(
      draggable,
      withClass(element, '_live_group'), // add clearfix hack
      withChild(element, slider.container)
    )

    console.log(sliderBox)

    return {
      ...slider,
      ...freezeBox(sliderBox),
      use : use,
      listen : listen
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
        fill.style[primary.position.end] = (x*100 + "%")
        fill.style[primary.position.start] = "0%";
        fill.style[secondary.dimension] = container[secondary.client] + "px"
    }
    function setRange(x,y) {
        fill.style[primary.position.start] = x*100 + "%";    
        fill.style[primary.position.end] = ((1-y)*100 + "%");
    }
    return { container, setFill, setRange };
}


export function createPopupSlider(element, axis) {
    let slider = createSlider(axis);

    return (event) => {
        switch(event.type) {
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