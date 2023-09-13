/**
 * Global cache of weakrefs for listeners. Slightly ugly typings as we don't know the parameter
 * type, but its a lookup by the object itself to an existing WeakRef, so definitionally the
 * types should match.
 */
const weakRefCache = new WeakMap<object, WeakRef<object>>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class WeakListenerSet<Listener extends (...args: any[]) => void> {
    #listenerRefs = new Set<WeakRef<Listener>>();

    public add(listener: Listener) {
        let weakRef = weakRefCache.get(listener) as WeakRef<Listener>;
        if (!weakRef) {
            weakRef = new WeakRef(listener);
        }
        weakRefCache.set(listener, weakRef);
        this.#listenerRefs.add(weakRef);
    }

    /**
     * The number of live listeners attached to this
     * @returns
     */
    public getLiveCount() {
        return [...this.#listenerRefs].reduce(
            (prev, weakRef) => prev + (weakRef.deref() ? 1 : 0),
            0,
        );
    }

    public remove(listener: Listener) {
        const weakRef = weakRefCache.get(listener) as WeakRef<Listener>;
        if (weakRef) {
            this.#listenerRefs.delete(weakRef);
        }
    }

    /**
     * Note that any exceptions thrown while invoking are swallowed, so if you need to handle
     * errors, catch them in the callback.
     * @param args
     */
    public announce(...args: Parameters<Listener>) {
        for (const ref of this.#listenerRefs) {
            const listener = ref.deref();

            if (listener) {
                try {
                    listener(...args);
                } catch (ex) {
                    console.error(
                        'Error swallowed while invoking listener',
                        listener,
                    );
                }
            } else {
                this.#listenerRefs.delete(ref);
            }
        }
    }
}
