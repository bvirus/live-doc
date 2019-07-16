
/*
Library code for handling traits
A trait is just pairs of functions. The first
is called start, the second is called stop. You
can pass those functions in as pairs or as an object literal.

When the user creates a component, they start it with .start(),
and stop it with .stop(). Those functions call the start and stop
functions for all of the traits in a component.
*/

// trait() creates a trait from a pair
export const trait = (start, stop) =>
    Object.freeze({ start, stop })

/*
fromTraits() creates an trait from a list of traits.
*/
export const fromTraits = (traits) => {
    const start = (...args) => traits.forEach(f => (f.start) ? f.start(...args) : null)
    const stop = (...args) => traits.reverse().forEach(f => (f.stop) ? f.stop(...args) : null)
    return Object.freeze({ start, stop })
}


/* these are some simple, common traits */

// adds a class to the element
export function withClass(element, className) {
    return trait(
        () => element.classList.add(className),
        () => element.classList.remove(className)
    )
}

// adds a child to the element
export function withChild(element, child) {
    return trait(
        () => element.appendChild(child),
        () => element.removeChild(child)
    )
}

// adds an event hanlder to the element
export function withEvent(element, event, handler) {
    return trait(
        () => element.addEventListener(event, handler),
        () => element.removeEventListener(event, handler)
    )
}