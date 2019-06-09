// force number between two values
export function clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
}

export function distance(x, y) {
    return Math.abs(x - y)
}

export function cancelEvent(ev) {
    ev.preventDefault();
    ev.stopPropagation();
}

// from https://thebookofshaders.com/glossary/?search=smoothstep
export function smoothstep(x, min, max) {
    let t = clamp(distance(x,min)/ distance(max,min), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

export function smoothBetween(val, { min, max }) {
    return clamp(min + distance(max,min)*val, min, max)
}

export const getWindowSize = (isX) => 
    isX ? window.innerWidth : window.innerHeight;

export const getBounds = (isX, el) => {
    if (el instanceof Window) {
        return { min: 0, max: getWindowSize() }
    } else {
        const rect = el.getBoundingClientRect();
        let min = isX ? rect.left : rect.top;
        let max = isX ? min + rect.width : min + rect.height;
        return { min, max: el.clientWidth }
    }
}

export const getPositionOnAxis = (isX, o) => isX ? o.clientX : o.clientY;