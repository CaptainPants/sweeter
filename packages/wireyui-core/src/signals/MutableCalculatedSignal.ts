import { CalculatedSignal } from '.';

export class MutableCalculatedSignal<T> extends CalculatedSignal<T> {
    constructor(calculation: () => T, mutate: (value: T) => void) {
        super(calculation);

        this.#mutate = mutate;
    }

    #mutate: (value: T) => void;

    public update(value: T) {
        this.#mutate(value);
    }
}

export function calcMutable<T>(
    calculation: () => T,
    mutate: (value: T) => void,
): MutableCalculatedSignal<T> {
    return new MutableCalculatedSignal<T>(calculation, mutate);
}
