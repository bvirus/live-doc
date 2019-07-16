
# Traits
Traits are a lightweight way to create plain javascript components that play nicely with each 
other and with bigger frameworks like React, Angular, Vue, etc. 

The API for most plain javascript components (sliders, buttons, click-to-drag, etc.) looks
like something this:
```js
let node = document.querySelector("#node")
let component = createComponent(node, /* config options */)
component.start() // called to attach event handlers, append child elements, etc.
component.stop() // called to undo the effects of component.start()
```
The modifications that happen in the component.start() function usually need to be undone in the component.stop() function, so the two are conceptually connected. A pair of connected
`.start()` and `.stop()` functions are called a trait.

The traits library provides a simple way to compose traits into more complex traits. This is useful because, in practice, most components are very similar to each other, and creating a component out of pre-existing traits can be very easy. For example:
```js
function createComponent(node, /* config */) {
    return fromTraits([
        withClass(node, 'component-container'),
        withChild(node, document.create('div')),
        withEvent(node, 'click', () => { /* handle click */ })
    ])
}
```
This `createComponent` function composes several traits together to create the functionality
of the component. `.start()` will add a class, a child element, and an event handler, while
`.stop()` will remove those things.

## Creating a trait

A trait is just a plain javascript object with start and stop methods:
```js
const myTrait = { start: () => {}, stop : () => {} }
```

There's a built in method, `trait` that compresses this:
```js
const myTrait = trait(() => { /* start */ }, () => { /* stop */ })
```
Because traits are designed to be composed, not modified, `trait` will call `Object.freeze()`
on the returned trait Object to make it immutable. 

Generally, you'll create traits with a factory function:
```js
function myTrait(option) {
    return trait(() => { /* start */ }, () => { /* stop */ })
}
```
The start and stop functions can take arguments. Whatever arguments are passed to 
`.start()` and `.stop()` are passed through.

```js
function myTrait(option) {
    return trait((option2) => { /* start */ }, (option3) => { /* stop */ })
}
```

## Composing traits

The `fromTraits` function lets you compose traits together:

```js
const myTrait = fromTraits([ trait1, trait2, trait3 ])
myTrait.start() // equivalent to trait1.start(), trait2.start(), trait3.start()
myTrait.stop() // equivalent to trait3.stop(), trait2.stop(), trait1.stop()
```

You'll notice that the traits are stopped in opposite order they're started in. This is so that if traits build on each other, somehow, they won't break when they are stopped.

Of course, traits created with `fromTraits()` can also be composed with `fromTraits()`

```js
const myTrait1 = fromTraits([...])
const myTrait2 = fromTraits([...])
const allTrait = fromTraits([myTrait1, myTrait2])
```

## Built in traits
They're pretty self-explanatory.

### withClass
`.start()` adds a class, `.stop()` removes it

### withEvent
`.start()` adds an event handler, `.stop()` removes it

### withChild
`.start()` adds an event handler, `.stop()` removes it

## Get creative!
Lot's of DOM manipulation can be simplified with traits. For example:

```js
const node = document.querySelector("#node")
const cancelEvent = (ev) => { ev.preventDefault(); ev.stopPropagation(); }

const dragging = fromTraits([
    trait(cancelEvent, cancelEvent),
    withClass(node, 'live-active'),
    withEvent(window, 'mousemove', (ev) => {
        sendEvent({ type : 'move', ...computeValue(ev) })
    }),
    Object.freeze({
        start: (ev) =>  sendEvent({ type : 'start', ...computeValue(ev) }),
        stop: (ev) =>   sendEvent({ type: 'stop', ...computeValue(ev) })
    })
])

node.addEventListener('mousedown', (ev) => {
    dragging.start(ev);
    window.addEventListener('mouseup', (ev) => dragging.stop(), { once : true })
})
```

This example is extracted from a library that enables simple click-and-drag functionality.
Although the `dragging` trait is never exposed to the user, it simplifies the code and makes it much more readable.