
# Traits

Traits are a lightweight way to create plain javascript components that play nicely with each 
other and with bigger frameworks like React, Angular, Vue, etc. 

The API looks like something this:
```js
let node = document.querySelector("#node")
let start = createComponent(node, /* config options */)
let stop = start() // called to attach event handlers, append child elements, etc.
stop() // called to undo the effects of start()
```
A trait is a function like `start`, which does some work, and then returns a `stop` function which undoes that work.

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
of the component.

## Creating a trait

A trait is just a plain javascript function that looks like this:
```js
const myTrait = (node, ...) => () => {
  // setup node
  return () => { /* cleanup node */ };
}
```

## Composing traits

The `fromTraits` function lets you compose traits together:

```js
const starr = fromTraits([ trait1, trait2, trait3 ])
const stop = start() // equivalent to trait1(), trait2(), trait3()
stop() // equivalent to stopping trait3, stopping trait2, and then stopping trait1
```

You'll notice that the traits are stopped in opposite order they're started in.
This is so that if traits build on each other, somehow, they won't break when they are stopped.
(Fun note: this is the socks-shoes property!)

Of course, traits created with `fromTraits()` can also be composed with `fromTraits()`

```js
const myTrait1 = fromTraits([...])
const myTrait2 = fromTraits([...])
const allTrait = fromTraits([myTrait1, myTrait2])
```

## Built in traits
They're pretty self-explanatory.

### withClass(className)
Encapsulates adding a class to a node.

### withEvent
Encapsulates adding an event handler to a node.

### withChild
Encapsulates adding a child element to a node.


## Get creative!
Lots of DOM manipulation can be simplified with traits. For example:

```js
const node = document.querySelector("#node")
const cancelEvent = (ev) => { 
    ev.preventDefault(); 
    ev.stopPropagation(); 
    return cancelEvent; 
}

const startDragging = fromTraits([
    cancelEvent,
    withClass(node, 'live-active'),
    withEvent(window, 'mousemove', (ev) => {
        sendEvent({ type : 'move', ...computeValue(ev) });
    }),
    (ev) => {
       sendEvent({ type : 'start', ...computeValue(ev) });
       return (ev) => sendEvent({ type: 'stop', ...computeValue(ev) });
    }
])

node.addEventListener('mousedown', (ev) => {
    const stop = startDragging(ev);
    window.addEventListener('mouseup', (ev) => stop(ev), { once : true });
})
```

This example is extracted from a library that enables simple click-and-drag functionality.
Although the `dragging` trait is never exposed to the user, it simplifies the code and makes it much more readable.