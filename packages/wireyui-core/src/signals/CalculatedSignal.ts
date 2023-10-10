import type { SavedExecutionContext } from '../executionContext/saveExecutionContext.js';
import { saveExecutionContext } from '../executionContext/saveExecutionContext.js';
import { SignalBase } from './SignalBase.js';
import { type SignalState } from './SignalState.js';
import { callAndReturnDependencies } from './ambient.js';
import { deferForBatch, isBatching } from './batching.js';
import { type Signal } from './types.js';

function wrap<T>(callback: () => T): () => SignalState<T> {
    const result = (): SignalState<T> => {
        try {
            const result = callback();
            return { mode: 'SUCCESS', value: result };
        } catch (ex) {
            return { mode: 'ERROR', error: ex };
        }
    };

    // Note: this doesn't actually help in stack traces, but can be useful in inspecting
    // the related signal to track it back to its source.
    Object.defineProperty(result, 'name', {
        value: `wrapped(${callback.name})`,
    });
    
    return result;
}

export class CalculatedSignal<T> extends SignalBase<T> {
    constructor(calculation: () => T) {
        const savedContext = saveExecutionContext();

        const wrapped = wrap(calculation);

        const { result: initialValue, dependencies } =
            callAndReturnDependencies(wrapped, true);

        super(initialValue);

        this.#capturedContext = savedContext;

        // Giving the function a name for debugging purposes
        const calculatedSignalListener = () => {
            if (isBatching()) {
                this.#dirty = true;
                deferForBatch(this);
                return;
            }

            // TODO: if running inside a batch we just mark it as dirty and register 
            // for updating at the end of the batch, not actually recalculate
            this._recalculate();
        };
        this.#dependencyListener = calculatedSignalListener;

        this.#wrappedCalculation = wrapped;
        this.#dependencies = dependencies;

        this.#attach();
    }

    #capturedContext: SavedExecutionContext;
    #wrappedCalculation: () => SignalState<T>;
    #dirty: boolean = false;
    #recalculating: boolean = false;

    /**
     * Strong references to any signal we depend upon.
     *
     * We rely on weak references in the other direction (Signal<T>.#listeners) to allow
     * cleanup of signals that are dependencies of Signals that have been garbage collected.
     */
    #dependencies: Set<Signal<unknown>>;

    /**
     * Bound as its used as its passed to .listen calls.
     */
    #dependencyListener: () => void;

    protected override _isDirty(): boolean {
        return this.#dirty;
    }

    protected override _recalculate() {
        if (this.#recalculating) {
            throw new TypeError(
                'Signal already recalculating - indicating a signal that depends on itself.',
            );
        }
        this.#recalculating = true;
        try {
            const revert = this.#capturedContext.restore();
            try {
                const { result, dependencies: nextDependencies } =
                    callAndReturnDependencies(this.#wrappedCalculation, true);

                this.#detachExcept(nextDependencies);
                this.#attach();

                this.#dependencies = nextDependencies;

                this.#dirty = false;
                this._updateAndAnnounce(result);
            } finally {
                revert();
            }
        } finally {
            this.#recalculating = false;
        }
    }

    public batchComplete() {
        if (this.#dirty) {
            this._recalculate();
            this.#dirty = false;
        }
    }

    #attach() {
        for (const dep of this.#dependencies) {
            // Holds a weak reference back to this signal
            dep.listen(this.#dependencyListener, /* strong: */ false);
        }
    }

    #detachExcept(set: Set<Signal<unknown>>) {
        for (const dep of this.#dependencies) {
            if (!set.has(dep)) {
                // Holds a weak reference back to this signal
                dep.unlisten(
                    this.#dependencyListener,
                    false /* strong: false */,
                );
            }
        }
    }
}

export function calc<T>(calculation: () => T): CalculatedSignal<T> {
    return new CalculatedSignal(calculation);
}
