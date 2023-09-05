import { Signal } from "./Signal";

export class MutableSignal<T> extends Signal<T> {
    constructor(initialValue: T) {
        super(initialValue);
    }

    set(value: T): void {
        super._set(value);
    }
}

export function mutable<T>(initialValue: T): MutableSignal<T> {
    return new MutableSignal<T>(initialValue);
}