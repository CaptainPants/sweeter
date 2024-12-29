import { SignalBase } from './SignalBase.js';
import { deferForBatchEnd, isBatching } from '../../batching.js';
import {
    SignalUpdateValuesAreEqualCallback,
    type CallbackDelayedRunner,
    type Signal,
} from '../../types.js';

export class FilteredSignal<T> extends SignalBase<T> {
    constructor(
        inner: Signal<T>,
        equals: SignalUpdateValuesAreEqualCallback<T>,
    ) {
        super(inner.peekState());

        this.#inner = inner;
        this.#equals = equals;

        // Giving the function a name for debugging purposes
        const filteredSignalListener = () => {
            if (isBatching()) {
                this.#dirty = true;
                deferForBatchEnd(this);
                return;
            }

            this.#recalculate();
        };
        // This will live as long as the containing signal lives
        this.#dependencyListener = filteredSignalListener;

        this.#inner.listenWeak(this.#dependencyListener);
    }

    #dirty: boolean = false;

    /**
     * Strong reference to the signal we depend on..
     */
    #inner: Signal<T>;
    #equals: SignalUpdateValuesAreEqualCallback<T>;

    /**
     * Bound as its used as its passed to .listen calls.
     */
    #dependencyListener: () => void;

    #recalculate() {
        const to = this.#inner.peekState();
        const from = this.peekState();

        this.#dirty = false;

        if (
            from.mode === 'SUCCESS' &&
            to.mode === 'SUCCESS' &&
            this.#equals(from.value, to.value)
        ) {
            return; // Skip update as we consider the values equal
        }
        this._updateAndAnnounce(to);
    }

    public batchComplete() {
        if (this.#dirty) {
            this.#recalculate();
            this.#dirty = false;
        }
    }
}
