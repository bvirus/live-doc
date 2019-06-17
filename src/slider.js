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
        use: (u) => drag.use(u),
        setRange: (x,y) => slider.setRange(x,y),
        setFill: (x) => slider.setFill(x),
        container: slider.container
    }
}

let dimensions = {
  x: {
    primary: {
      position: {
        start: 'left',
        end: 'right'
      },
      dimension: 'width'
    },
    secondary: {
      position: {
        start: 'top', 
        end: 'bottom'
      },
      dimension: 'height'
    }
  },
  y: {
    primary: {
      position: {
        start: 'top', 
        end: 'bottom',
      },
      dimension: 'height'
    },
    secondary: {
      position: {
        start: 'left', 
        end: 'right'
      },
      dimension: 'width'
    }
  }
}

export function createBoundary(element, axis = 'x') {
  let dim = dimensions[axis];
  
  function makeSetterAlong(along) {
    return (x, y) => {
      element.style[dim[along][0]] = x;
      if (y !== undefined) element.style[dim[along][1]] = y;
    }
  }
  
  return { 
    setPrimary: makeSetterAlong('primary'), 
    setSecondary: makeSetterAlong('secondary')
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

    let background = document.createElement("span");
    let backgroundBoundary = createBoundary(container, axis)
    background.classList.add('live-slider-background')
    Object.assign(background.style, {
        position: "absolute",
        [primary.dimension]: "100%",
        [secondary.dimension]: "100%",
    })
    backgroundBoundary.setPrimary(0,0)
    

    let fill = document.createElement("span");
    let fillBoundary = createBoundary(container, axis)
    fill.classList.add('live-slider-fill')
    let primaryPosition = (axis==='x')?"left":"top";
    let secondaryPosition = (axis==='x')?"top":"left";
    Object.assign(fill.style, {
        position: 'absolute',
        [secondary.dimension]: "100%",
        [primary.position.start]: 0,
        [secondary.position.start]: 0
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
    function setFill(x) {
        let primarySize = container['client' + primaryDimension[0].toUpperCase() + primaryDimension.slice(1)]
        fill.style[primary.position.end] = (x*100 + "%")
        fill.style[primary.position.start] = "0%";
        let secondarySize = container['client' + secondaryDimension[0].toUpperCase() + secondaryDimension.slice(1)]
        fill.style[secondary.dimension] = secondarySize + "px"
    }
    function setRange(x,y) {
        fill.style[primary.position.start] = x*100 + "%";    
        fill.style[primary.position.end] = ((1-y)*100 + "%");
    }
    return { container, setFill, setRange, displayNear, container };
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