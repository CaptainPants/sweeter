import { StackTrace } from '@captainpants/sweeter-utilities';

import { dev } from '../../dev.js';
import { type Signal, type SignalListener } from '../types.js';

/**
 * Global cache of weakrefs for listeners. Slightly ugly typings as we don't know the parameter
 * type, but its a lookup by the object itself to an existing WeakRef, so definitionally the
 * types should match.
 */
const weakRefCache = new WeakMap<object, WeakRef<object>>();

export type SignalChangeListenerSetCallback<T> = SignalListener<T> & {
    debugListenerForSignal?: Signal<unknown>;
};

const stackTraceFlag = 'signal.debugStackTraces';

export class SignalChangeListenerSet<T> {
    constructor() {
        if (dev.flag(stackTraceFlag)) {
            this.#debugStackTraces = new WeakMap();
        }
    }

    #listenerRefs = new Set<
        | WeakRef<SignalChangeListenerSetCallback<T>>
        | SignalChangeListenerSetCallback<T>
    >();

    #debugStackTraces?: WeakMap<object, StackTrace>;

    /**
     *
     * Note that any exceptions thrown while invoking are swallowed, so if you need to handle
     * errors, catch them in the callback.
     * @param listener A callback to be called later, when using 'announce'.
     * @param strong If this is false, only a weak reference will be held to the listener. If there are no other references to this callback it may be garbage collected.
     */
    public add(listener: SignalChangeListenerSetCallback<T>, strong: boolean) {
        if (strong) {
            this.#listenerRefs.add(listener);
        } else {
            let weakRef = weakRefCache.get(listener) as WeakRef<
                SignalChangeListenerSetCallback<T>
            >;
            if (!weakRef) {
                weakRef = new WeakRef(listener);
            }
            weakRefCache.set(listener, weakRef);
            this.#listenerRefs.add(weakRef);
        }

        if (dev.flag(stackTraceFlag)) {
            this.#debugStackTraces?.set(
                listener,
                new StackTrace({
                    context: 'Generated from SignalChangeListenerSet.add',
                }),
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

    /**
     * This is intended for debug only. Retaining references to the results of this call will prevent garbage collection.
     * @returns
     */
    public debugGetAllListeners(): ListenerSetDebugItem<T>[] {
        return (
            [...this.#listenerRefs]
                .map((listener) => {
                    const derefed =
                        listener instanceof WeakRef
                            ? listener.deref()
                            : listener;
                    if (!derefed) {
                        // If its been collected
                        return undefined;
                    }

                    const res: ListenerSetDebugItem<T> = {
                        listener: derefed,
                        addedStackTrace: this.#debugStackTraces?.get(derefed),
                        weak: listener instanceof WeakRef,
                    };
                    return res;
                })
                // Some derefed items may have been garbage collected
                .filter((x): x is ListenerSetDebugItem<T> => Boolean(x))
        );
    }

    public get getDebugSummary(): string {
        const strongRefs = [...this.#listenerRefs.values()]
            .map((x) => (x instanceof WeakRef ? undefined : x))
            .filter((x) => x);
        const weakRefsAlive = [...this.#listenerRefs.values()]
            .map((x) => (x instanceof WeakRef ? x.deref() : undefined))
            .filter((x) => x);

        const topLine = `SignalChangeListenerSet(strong: ${strongRefs.length} {${strongRefs
            .map((x) => x?.name ?? '?')
            .join(', ')}}, weak: ${weakRefsAlive.length} {${weakRefsAlive
            .map((x) => x?.name ?? '?')
            .join(', ')}})`;

        return topLine + (dev.isEnabled ? '\n\n' + this.getDebugDetail() : '');
    }

    public getDebugDetail(): string {
        // This will not include stack traces if !dev.flag('signalStacks')
        return this.debugGetAllListeners()
            .map((item, i) => {
                const stackTrace =
                    item.addedStackTrace?.getNice() ?? '<no stack trace>\n';
                return `== Listener ${i} (${item.weak ? 'Weak' : 'Strong'}) ==\n${stackTrace}== END Listener ${i} ==`;
            })
            .join('\n\n');
    }

    public remove(
        listener: SignalChangeListenerSetCallback<T>,
        strong: boolean,
    ) {
        if (strong) {
            this.#listenerRefs.delete(listener);
        } else {
            const weakRef = weakRefCache.get(listener) as WeakRef<
                SignalChangeListenerSetCallback<T>
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
    public announce(...args: Parameters<SignalChangeListenerSetCallback<T>>) {
        const listeners = this.#listenerRefs;

        for (const ref of listeners) {
            const listener = ref instanceof WeakRef ? ref.deref() : ref;

            if (listener) {
                try {
                    listener(...args);
                } catch (ex) {
                    dev.swallowedError(
                        'Error swallowed while invoking listener',
                        ex,
                        listener,
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
    listener: SignalChangeListenerSetCallback<T>;
    addedStackTrace?: StackTrace | undefined;
    weak: boolean;
}
