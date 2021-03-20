// force number between two values
export function clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
}

export function cancelEvent(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    return cancelEvent;
}