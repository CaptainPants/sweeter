import { SignalBase } from './SignalBase';

export class MutableSignal<T> extends SignalBase<T> {
    constructor(initialValue: T) {
        super({ mode: 'SUCCESS', value: initialValue });
    }

    update(value: T): void {
        super._set({ mode: 'SUCCESS', value: value });
    }
}

export function mutable<T>(initialValue: T): MutableSignal<T> {
    return new MutableSignal<T>(initialValue);
}
