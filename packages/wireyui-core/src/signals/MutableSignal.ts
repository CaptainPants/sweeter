import { SignalBase } from './SignalBase';

export class MutableSignal<T> extends SignalBase<T> {
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
