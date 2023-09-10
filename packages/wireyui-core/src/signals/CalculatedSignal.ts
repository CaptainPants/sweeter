import { Signal } from './Signal';
import { listenForSignalUsage } from './ambient';

export class CalculatedSignal<T> extends Signal<T> {
    constructor(calculation: () => T) {
        const { result: initialValue, dependencies } =
            listenForSignalUsage(calculation);

        super(initialValue);

        this.#calculation = calculation;
        this.#dependencies = dependencies;
    }

    #calculation: () => T;
    #dependencies: Set<Signal<unknown>>;

    /**
     * Bound as its used as its passed to .listen calls.
     */
    #dependentListener = () => {
        this.#recalculate();
    };

    #recalculate() {
        const { result, dependencies: nextDependencies } = listenForSignalUsage(
            this.#calculation,
        );

        if (this.anyListeners) {
            this.#detachExcept(nextDependencies);
            this.#attach();
        }

        this.#dependencies = nextDependencies;

        this._set(result);
    }

    protected override _firstListenerAttached(): void {
        this.#attach();
    }

    protected override _lastListenerDetached(): void {
        this.#detach();
    }

    #attach() {
        for (const dep of this.#dependencies) {
            dep.listen(this.#dependentListener);
        }
    }

    #detach() {
        for (const dep of this.#dependencies) {
            dep.unlisten(this.#dependentListener);
        }
    }

    #detachExcept(set: Set<Signal<unknown>>) {
        for (const dep of this.#dependencies) {
            if (!set.has(dep)) {
                dep.unlisten(this.#dependentListener);
            }
        }
    }
}

export function calc<T>(calculation: () => T): Signal<T> {
    return new CalculatedSignal(calculation);
}
