import { type SavedExecutionContext } from '../../../executionContext/saveExecutionContext.js';
import { saveExecutionContext } from '../../../executionContext/saveExecutionContext.js';
import { SignalBase } from './SignalBase.js';
import {
    type CallAndReturnDependenciesResult,
    callAndReturnDependencies,
} from '../../ambient.js';
import { deferForBatchEnd, isBatching } from '../../batching.js';
import {
    type Signal,
    type DerivedSignalOptions,
    SignalListener,
} from '../../types.js';
import { type ListenerSetCallback } from '../ListenerSet.js';
import {
    finishCalculation,
    startCalculation,
} from '../../calculationDeferral.js';
import { SignalState } from '../../SignalState.js';
import { DerivationCallback } from '../../$derived.js';

export class DerivedSignal<T> extends SignalBase<T> {
    constructor(
        calculation: DerivationCallback<T>,
        options?: DerivedSignalOptions,
    ) {
        // Capture execution context before we do anything else
        const savedContext = saveExecutionContext();

        super(SignalState.init());

        // We can't use this. before calling super, so this is separated from the saveExecutionContext() call
        this.#capturedContext = savedContext;

        // Giving the function a name for debugging purposes
        const derivedSignalListener: SignalListener<unknown> = (
            _1,
            _2,
            trigger,
        ) => {
            if (isBatching()) {
                this.#dirty = true;
                this.#dirtyCause = trigger;
                deferForBatchEnd(this);
                return;
            }

            this.#recalculate(trigger);
        };
        // For building debug tree. The 'as' just gets us type safety for the property.
        (
            derivedSignalListener as ListenerSetCallback<T>
        ).debugListenerForSignal = this;

        this.#dependencyListener = derivedSignalListener;

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

    #calculation: DerivationCallback<T>;

    // Not included by default to represent 'false' so we don't need to add the actual property until we need to
    #released?: boolean;

    #dirty?: boolean | undefined;
    #dirtyCause?: Signal<unknown> | undefined;

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
    #dependencyListener: SignalListener<unknown>;

    protected override _peeking(): void {
        if (this.#dirty) {
            this.#recalculate(this.#dirtyCause);
        }
    }

    protected override _init(): void {
        this.#recalculate(this.#dirtyCause);
    }

    #deriveState(result: CallAndReturnDependenciesResult<T>): SignalState<T> {
        if (result.succeeded) {
            return SignalState.success(result.result);
        } else {
            return SignalState.error(result.error);
        }
    }

    #recalculate(cause: Signal<unknown> | undefined) {
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
                const result = callAndReturnDependencies(
                    this.#calculation,
                    true,
                    cause,
                );

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
                this.#dirtyCause = undefined;
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
            this.#recalculate(this.#dirtyCause);
            this.#dirty = false;
            this.#dirtyCause = undefined;
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
