export class Number {
    set(x) {
        if (this.frameId !== null) cancelAnimationFrame(this.frameId);
        if (this.listeners.length === 0) return;
        if (hasPrev && x == prev) return;

        x = clamp(x, config.range.min, config.range.max);

        this.frameId = requestAnimationFrame(() => {
            this.frameId = null;
            this.listeners.forEach(l => this.config.map ? l(config.map(x)) : l(x));
        });
    }

    listen(f) {
        this.listeners.push(f);
        let index = this.listeners.length - 1;
        return () => { this.listeners.splice(index); }
    }

    destroy() { cancelAnimationFrame(this.frameId); }
}