import { StackTrace } from '@captainpants/sweeter-utilities';
import { type Signal, dev, type SignalListener } from '../../index.js';

/**
 * Global cache of weakrefs for listeners. Slightly ugly typings as we don't know the parameter
 * type, but its a lookup by the object itself to an existing WeakRef, so definitionally the
 * types should match.
 */
const weakRefCache = new WeakMap<object, WeakRef<object>>();

export type ListenerSetCallback<T> = SignalListener<T> & {
    updateFor?: Signal<unknown>;
};

export class ListenerSet<T> {
    constructor() {
        if (dev.isEnabled) {
            this.#debugStackTraces = new WeakMap();
        }
    }

    #listenerRefs = new Set<
        WeakRef<ListenerSetCallback<T>> | ListenerSetCallback<T>
    >();

    #debugStackTraces?: WeakMap<object, StackTrace>;

    /**
     *
     * Note that any exceptions thrown while invoking are swallowed, so if you need to handle
     * errors, catch them in the callback.
     * @param listener A callback to be called later, when using 'announce'.
     * @param strong If this is false, only a weak reference will be held to the listener. If there are no other references to this callback it may be garbage collected.
     */
    public add(listener: ListenerSetCallback<T>, strong: boolean) {
        if (strong) {
            this.#listenerRefs.add(listener);
        } else {
            let weakRef = weakRefCache.get(listener) as WeakRef<
                ListenerSetCallback<T>
            >;
            if (!weakRef) {
                weakRef = new WeakRef(listener);
            }
            weakRefCache.set(listener, weakRef);
            this.#listenerRefs.add(weakRef);
        }

        if (dev.isEnabled) {
            this.#debugStackTraces?.set(
                listener,
                new StackTrace({ context: 'Generated from ListenerSet.add' }),
            );
        }
    }

    /**
     * The number of live listeners attached to this - only really useful for debugging held references
     * @returns
     */
    public getLiveCount() {
        return [...this.#listenerRefs].reduce(
            (prev, weakRef) =>
                prev +
                (weakRef instanceof WeakRef ? (weakRef.deref() ? 1 : 0) : 1),
            0,
        );
    }

    any(): boolean {
        return this.#listenerRefs.size > 0;
    }

    public get summarized(): string {
        const strongRefs = [...this.#listenerRefs.values()]
            .map((x) => (x instanceof WeakRef ? undefined : x))
            .filter((x) => x);
        const weakRefsAlive = [...this.#listenerRefs.values()]
            .map((x) => (x instanceof WeakRef ? x.deref() : undefined))
            .filter((x) => x);

        const topLine = `ListenerSet(strong: ${strongRefs.length} {${strongRefs
            .map((x) => x?.name ?? '?')
            .join(', ')}}, weak: ${weakRefsAlive.length} {${weakRefsAlive
            .map((x) => x?.name ?? '?')
            .join(', ')}})`;

        return topLine + (dev.isEnabled ? '\n\n' + this.getDebugDetail() : '');
    }

    /**
     * This is intended for debug only. Retaining references to the results of this call will prevent garbage collection.
     * @returns
     */
    public debugGetAllListeners(): ListenerSetDebugItem<T>[] {
        return (
            [...this.#listenerRefs]
                .map((x) => (x instanceof WeakRef ? x.deref() : x))
                // Some derefed items may have been garbage collected
                .filter((x): x is ListenerSetCallback<T> => Boolean(x))
                .map((x) => ({
                    listener: x,
                    stackTrace: this.#debugStackTraces
                        ? this.#debugStackTraces.get(x)
                        : undefined,
                }))
        );
    }

    public getDebugDetail(): string {
        // TODO: output the .updateFor tree for each listener
        // possibly can truncate call stacks to make it reasable
        // or output as JSON so we can do work on the stack trace
        // outside of the debugger

        // This will not include stack traces if dev.isEnabled == false
        return this.debugGetAllListeners()
            .map((item, i) => {
                const stackTrace =
                    item.addedStackTrace?.getNice() ?? '<no stack trace>\n';
                return `== Listener ${i} ==\n${stackTrace}== END Listener ${i} ==`;
            })
            .join('\n\n');
    }

    public remove(listener: ListenerSetCallback<T>, strong: boolean) {
        if (strong) {
            this.#listenerRefs.delete(listener);
        } else {
            const weakRef = weakRefCache.get(listener) as WeakRef<
                ListenerSetCallback<T>
            >;
            if (weakRef) {
                this.#listenerRefs.delete(weakRef);
            }
        }
    }

    /**
     * Note that any exceptions thrown while invoking are swallowed, so if you need to handle
     * errors, catch them in the callback.
     * @param args
     */
    public announce(...args: Parameters<ListenerSetCallback<T>>) {
        for (const ref of this.#listenerRefs) {
            const listener = ref instanceof WeakRef ? ref.deref() : ref;

            if (listener) {
                try {
                    listener(...args);
                } catch (ex) {
                    console.warn(
                        'Error swallowed while invoking listener',
                        listener,
                        ex,
                    );
                }
            } else {
                // Delete any references to collected objects
                // This is safe to do during iteration according to
                this.#listenerRefs.delete(ref);
            }
        }
    }

    public clear() {
        this.#listenerRefs.clear();
    }
}

export interface ListenerSetDebugItem<T> {
    listener: ListenerSetCallback<T>;
    addedStackTrace?: StackTrace | undefined;
}
