import { Signal } from './Signal';
import { listenForSignalUsage } from './ambient';

export class CalculatedSignal<T> extends Signal<T> {
    constructor(calculation: () => T) {

        const { result: initialValue, dependencies } = listenForSignalUsage(
            calculation
        );

        super(initialValue);

        this.#calculation = calculation;
        this.#dependencies = dependencies;
    }

    #calculation: () => T;
    #dependencies: Set<Signal<unknown>>;
}

export function calc<T>(calculation: () => T): Signal<T> {
    return new CalculatedSignal(calculation);
}
