import { SignalBase } from './SignalBase.js';
import { deferForBatch, isBatching } from './batching.js';
import { type Signal } from './types.js';

export class DeferredSignal<T> extends SignalBase<T> {
    constructor(inner: Signal<T>) {
        super(inner.peekState());

        this.#inner = inner;

        // Giving the function a name for debugging purposes
        const deferredSignalListener = () => {
            if (isBatching()) {
                this.#dirty = true;
                deferForBatch(this);
                return;
            }

            this.#recalculate();
        };
        this.#dependencyListener = deferredSignalListener;

        this.#inner.listen(this.#dependencyListener, false);
    }

    #dirty: boolean = false;

    /**
     * Strong reference to the signal we depend on..
     */
    #inner: Signal<T>;

    /**
     * Bound as its used as its passed to .listen calls.
     */
    #dependencyListener: () => void;

    #recalculate() {
        const captured = this.#inner.peekState();

        this.#dirty = false;

        queueMicrotask(() => {
            this._updateAndAnnounce(captured);
        });
    }

    public batchComplete() {
        if (this.#dirty) {
            this.#recalculate();
            this.#dirty = false;
        }
    }
}

export function deferred<T>(inner: Signal<T>): DeferredSignal<T> {
    return new DeferredSignal(inner);
}
