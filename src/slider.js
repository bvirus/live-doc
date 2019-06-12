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
        set: (w) => slider.set(w),
        container: slider.container
    }
}

export function createSlider(axis = 'x') {
    let container = document.createElement('div');
    container.classList.add('live-slider')
    let primaryDimension = (axis === 'x')?'width':'height';
    let secondaryDimension = (axis === 'x')?'height':'width';
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
    let primaryPosition = (axis==='x')?"left":"top";
    let secondaryPosition = (axis==='x')?"top":"left";
    Object.assign(fill.style, {
        position: 'absolute',
        [secondaryDimension]: "100%",
        [primaryPosition]: 0,
        [secondaryPosition]: 0
    })
    
    background.appendChild(fill)
    container.appendChild(background);

    function displayNear(element) {
        let rect = element.getBoundingClientRect();
        // let top = Math.max(getWindowSize(axis === 'x').min, rect.top + rect.height + 5)
        let b1 = 'top', b2 = 'left', d1 = 'width', d2='height';
        if (axis === 'y') d1='height', d2='width';
        let topOffset, leftOffset;
        if (axis === 'x') {
            topOffset = rect.height + 5;
            leftOffset = rect.width/2 - (50)
        } else if (axis == 'y') {
            topOffset = rect.height/2 - 50
            leftOffset = rect.width + 20;
        }
        Object.assign(container.style, {
            position: 'absolute',
            top: rect.top + rect.height + topOffset + "px",
            left: (rect.left + leftOffset) + "px",
            minWidth: "0px",
            minHeight: "0px",
            [primaryDimension]: "80px", // make dynamic
            [secondaryDimension]: "10px"
        });
    }
    function set(x) {
        let primarySize = container['client' + primaryDimension[0].toUpperCase() + primaryDimension.slice(1)]
        fill.style[primaryDimension] = (x*100 + "%")
        let secondarySize = container['client' + secondaryDimension[0].toUpperCase() + secondaryDimension.slice(1)]
        fill.style[secondaryDimension] = secondarySize + "px"
    }
    return { container, set, displayNear, container };
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