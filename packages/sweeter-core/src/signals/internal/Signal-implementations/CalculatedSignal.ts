import { type SavedExecutionContext } from '../../../executionContext/saveExecutionContext.js';
import { saveExecutionContext } from '../../../executionContext/saveExecutionContext.js';
import { SignalBase } from './SignalBase.js';
import { CallAndReturnDependenciesResult, callAndReturnDependencies } from '../../ambient.js';
import { deferForBatchEnd, isBatching } from '../../batching.js';
import {
    type SignalState,
    type Signal,
    type CalculatedSignalOptions,
} from '../../types.js';
import { type ListenerSetCallback } from '../ListenerSet.js';
import {
    finishCalculation,
    startCalculation,
} from '../../calculationDeferral.js';

export class CalculatedSignal<T> extends SignalBase<T> {
    constructor(calculation: () => T, options?: CalculatedSignalOptions) {
        const savedContext = saveExecutionContext();

        super({ mode: 'INITIALISING' });

        this.#capturedContext = savedContext;

        // Giving the function a name for debugging purposes
        const calculatedSignalListener = () => {
            if (isBatching()) {
                this.#dirty = true;
                deferForBatchEnd(this);
                return;
            }

            this.#recalculate();
        };
        // For building debug tree. The 'as' just gets us type safety for the property.
        (
            calculatedSignalListener as ListenerSetCallback<T>
        ).debugListenerForSignal = this;

        this.#dependencyListener = calculatedSignalListener;

        this.#calculation = calculation;

        // Initially no dependencies, until .value/.peekState(true) is invoked and causes deps to be filled
        this.#dependencies = new Set();

        options?.release?.addEventListener('abort', () => {
            // Note that this might not be inited - but thats ok it will just do the calculation once
            this.#released = true;
            this.#dependencies = new Set();
            this.#detachAll();
        });
    }

    #capturedContext: SavedExecutionContext;

    #calculation: () => T;

    // Not included by default to represent 'false' so we don't need to add the actual property until we need to
    #released?: boolean;
    #dirty?: boolean;

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

    protected override _peeking(): void {
        if (this.#dirty) {
            this.#recalculate();
        }
    }

    protected override _init(): void {
        this.#recalculate();
    }

    #deriveState(result: CallAndReturnDependenciesResult<T>): SignalState<T> {
        if (result.succeeded) {
            return {
                mode: 'SUCCESS',
                value: result.result
            };
        }
        else {
            return {
                mode: 'ERROR',
                error: result.error
            };
        }
    }

    #recalculate() {
        // if already initialized and has been orphaned then end here.
        if (this.inited && this.#released) {
            return;
        }

        if (this.#recalculating) {
            throw new TypeError(
                'Signal already recalculating - indicating a signal that depends on itself.',
            );
        }
        this.#recalculating = true;
        startCalculation();
        try {
            const revert = this.#capturedContext.restore();
            try {
                const result = callAndReturnDependencies(this.#calculation, true);

                const nextState = this.#deriveState(result);
                const nextDependencies = result.dependencies;

                this.#detachExcept(nextDependencies);

                // Not sure why this if is here
                if (!this.#released) {
                    // Call in this order
                    this.#dependencies = nextDependencies;
                    this.#attach();
                }

                this.#dirty = false;
                this._updateAndAnnounce(nextState);
            } finally {
                revert();
            }
        } finally {
            this.#recalculating = false;
            finishCalculation();
        }
    }

    public batchComplete() {
        if (this.#dirty) {
            this.#recalculate();
            this.#dirty = false;
        }
    }

    #attach() {
        for (const dep of this.#dependencies) {
            // Holds a weak reference back to this signal
            dep.listenWeak(this.#dependencyListener);
        }
    }

    #detachExcept(set: Set<Signal<unknown>>) {
        for (const dep of this.#dependencies) {
            if (!set.has(dep)) {
                // Holds a weak reference back to this signal
                dep.unlistenWeak(this.#dependencyListener);
            }
        }
    }

    #detachAll() {
        for (const dep of this.#dependencies) {
            // Holds a weak reference back to this signal
            dep.unlistenWeak(this.#dependencyListener);
        }
    }
}
