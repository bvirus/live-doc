// force number between two values
export function clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
}

function distance(x, y) {
    return Math.abs(x - y)
}


// from https://thebookofshaders.com/glossary/?search=smoothstep
export function smoothstep(x, min, max) {
    let t = clamp(distance(x,min)/ distance(max,min), 0.0, 1.0);
    return t * t * (3.0 - 2.0 * t);
}

export function smoothBetween(val, { min, max }) {
    return clamp(min + distance(max,min)*val, min, max)
}