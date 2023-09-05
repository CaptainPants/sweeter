import { Signal } from "./Signal";

export class CalculatedSignal<T> extends Signal<T> {
    constructor(calculation: () => T) {
        super(calculation());
    }
}

export function calc<T>(calculation: () => T): Signal<T> {
    return new CalculatedSignal(calculation);
}