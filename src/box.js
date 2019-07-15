
export const boxObject = ({ start, stop, handle }) => box(start, stop, handle)
export const box = (start, stop, handle) => Object.freeze([start, stop, handle])
export const start = (box, ...args) => box.forEach(f => (f[0]) ? f[0](...args) : null)
export const stop = (box, ...args) => box.forEach(f => (f[1]) ? f[1](...args) : null)
export const handle = (box, ...args) => box.forEach(f => f[2] ? f[2](...args) : null)

export const enable     = start
export const disable    = stop

export const freezeBox = (box) => {
    return Object.freeze({
        enable: (...args) =>    enable(box, ...args),
        disable : (...args) =>  disable(box, ...args),
        start : (...args) =>    start(box, ...args),
        stop: (...args) =>      stop(box, ...args),
        handle: (...args) =>    handle(box, ...args)
    })
}

export function withClass(element, className) {
    return box(
        () => element.classList.add(className),
        () => element.classList.remove(className)
    )
}
  
export function withChild(element, child) {
    return box(
        () => element.appendChild(child),
        () => element.removeChild(child)
    )
}

export function withEvent(element, event, handler) {
    return box(
        () => element.addEventListener(event, handler),
        () => element.removeEventListener(event, handler)
    )
}