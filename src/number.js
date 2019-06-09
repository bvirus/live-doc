import { makeDraggableNumber } from './drag-number';
import { createSlider, sliderPercent } from './slider';
import { getBounds } from './util';

export function number(element, store, config) {
    element.classList.add('live-number');
    config.container = window;
    function popupSlider() {

    }
    element.addEventListener('mousedown', (ev) => {
        let slider = createSlider();
        let rect = element.getBoundingClientRect()
        let sliderBounds = slider.container.getBoundingClientRect();
        Object.assign(slider.container.style, {
            position: 'absolute',
            top: rect.top + rect.height + 5 + "px",
            left: (rect.left - (50)) + "px",
            width: "100px" // make dynamic
        });
        document.body.appendChild(slider.container);
        let destroy = store.listen(x => {
            slider.setWidth(sliderPercent(x, store))
        });
        window.addEventListener('mouseup', () => {
            document.body.removeChild(slider.container);
        }, { once: true })
    });
    let destroyNumber = makeDraggableNumber(element, store, config, (v) => {
        if (config.format) v = config.format(v);
        element.textContent = v;
    })
    return () => {
        destroyNumber();

    }
}
