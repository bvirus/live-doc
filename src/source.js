export function createSource() {
    let frameId = null;
    let listeners = [];
    let prev = null;

    function provide(x) {
        // I think the entire requestAnimationFrame machinery
        // is unecessary -- I'm pretty sure it doesn't generate
        // too many events
        // if (frameId !== null && x.type === prev.type) {
        //     cancelAnimationFrame(frameId);
        // } 
        if (listeners.length === 0) return;
        // if (hasPrev && x == prev) return;
        prev = x;
        // x = clamp(x, config.range.min, config.range.max);
        listeners.forEach(l => l(x));
        // frameId = requestAnimationFrame(() => {
        //     frameId = null;
            
        // });
    }

    function listen(f) {
        listeners.push(f);
        return () => { listeners = listeners.filter(x => x !== f) }
    }

    let destroy = () => {}

    return {
        listen,
        provide,
        destroy
    }
}