import { SignalBase } from '../SignalBase.js';
import { deferForBatch, isBatching } from '../batching.js';
import { type Later, type Signal } from '../types.js';

export class DeferredSignal<T> extends SignalBase<T> {
    constructor(inner: Signal<T>, later: Later = queueMicrotask) {
        super(inner.peekState());

        this.#inner = inner;
        this.#later = later;

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
    #later: Later;

    /**
     * Bound as its used as its passed to .listen calls.
     */
    #dependencyListener: () => void;

    #recalculate() {
        const captured = this.#inner.peekState();

        this.#dirty = false;

        this.#later(() => {
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
