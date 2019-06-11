import { distance, smoothBetween } from './util';
import { makeDraggable } from './live-drag';

export function sliderPercent(v, store) {
    return (distance(v, store.range.min)/distance(store.range.min, store.range.max))
}

export function slider(element) {
    let slider = createSlider();


    let drag = makeDraggable(element,'x', element);
    
    return { 
        disable: () => {
            drag.disable();
            element.classList.remove('_live_group');
            element.removeChild(slider.container);
        },
        enable: () => {
            drag.enable();
            element.classList.add('_live_group'); // add clearfix hack
            element.appendChild(slider.container)
        },
        listen: (l) => drag.listen(l),
        setWidth: (w) => slider.setWidth(w)
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


export function createPopupSlider() {
    let slider = createSlider();

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
                slider.setWidth(event.value);
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