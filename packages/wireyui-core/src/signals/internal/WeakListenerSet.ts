// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class WeakListenerSet<Listener extends (...args: any[]) => void> {
    #weakRefCache = new WeakMap<Listener, WeakRef<Listener>>();
    #listenerRefs = new Set<WeakRef<Listener>>();

    public add(listener: Listener) {
        let weakRef = this.#weakRefCache.get(listener);
        if (!weakRef) {
            weakRef = new WeakRef(listener);
        }
        this.#weakRefCache.set(listener, weakRef);
        this.#listenerRefs.add(weakRef);
    }

    public getLiveCount() {
        return [...this.#listenerRefs].reduce((prev, weakRef) => prev + (weakRef.deref() ? 1 : 0), 0);
    }

    public remove(listener: Listener) {
        const weakRef = this.#weakRefCache.get(listener);
        if (weakRef) {
            this.#listenerRefs.delete(weakRef);
        }
    }

    public announce(...args: Parameters<Listener>) {
        for (const ref of this.#listenerRefs) {
            const listener = ref.deref();

            if (listener) {
                try {
                    listener(...args);
                } catch (ex) {
                    console.error('Error invoking listener', listener);
                }
            } else {
                this.#listenerRefs.delete(ref);
            }
        }
    }
}
