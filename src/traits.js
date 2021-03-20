
/*
Library code for handling traits
A trait is specific pattern for functions.
When you call the function, it does some kind of setup functionality.
Then, it returns a cleanup function that undoes that setup.

Usually, you call a factory function which returns a trait.
*/

/*
fromTraits() creates an trait from a list of traits.
*/
export const fromTraits = (traits) => (...args) => {
	const cleans = traits.map(f => f(...args));
	return (...args) => cleans.reverse().map(f => f(...args));
}

/* these are some simple, common trait factory functions */

// adds a class to the element
export const withClass = (node, className) => () => {
	node.classList.add(className);
	return () => node.classList.remove(className)
}


// adds a child to the element
export const withChild = (node, child) => () => {
	node.appendChild(child);
	return () => node.removeChild(child)
}

// adds an event hanlder to the element
export const withEvent = (node, event, handler) => () => {
	node.addEventListener(event, handler);
	return () => node.removeEventListener(event, handler);
}

export const withAttribute = (node, attribute, value = true) => () => {
    const oldValue = node.getAttribute(attribute);
    node.setAttribute(attribute, value);
    return () => {
        if (oldValue) node.setAttribute(attribute, oldValue);
        else node.removeAttribute(attribute);
    }
}