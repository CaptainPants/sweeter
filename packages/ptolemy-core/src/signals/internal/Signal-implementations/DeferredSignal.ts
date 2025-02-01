import { deferForBatchEnd, isBatching } from '../../batching.js';
import { type CallbackDelayedRunner, type Signal } from '../../types.js';

import { NormalSignalBase } from './NormalSignalBase.js';

export class DeferredSignal<T> extends NormalSignalBase<T> {
    constructor(
        inner: Signal<T>,
        later: CallbackDelayedRunner = queueMicrotask,
    ) {
        super(inner.peekState());

        this.#inner = inner;
        this.#later = later;

        // Giving the function a name for debugging purposes
        const deferredSignalListener = () => {
            if (isBatching()) {
                this.#dirty = true;
                deferForBatchEnd(this);
                return;
            }

            this.#recalculate();
        };
        // This will live as long as the containing signal lives
        this.#dependencyListener = deferredSignalListener;

        this.#inner.listenWeak(this.#dependencyListener);
    }

    #dirty: boolean = false;

    /**
     * Strong reference to the signal we depend on..
     */
    #inner: Signal<T>;
    #later: CallbackDelayedRunner;

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
