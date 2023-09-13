import { SignalBase } from './SignalBase';
import { announceMutatingSignal } from './ambient';

export class MutableValueSignal<T> extends SignalBase<T> {
    constructor(initialValue: T) {
        super({ mode: 'SUCCESS', value: initialValue });
    }

    update(value: T): void {
        announceMutatingSignal(this);
        super._set({ mode: 'SUCCESS', value: value });
    }
}

export function mutable<T>(initialValue: T): MutableValueSignal<T> {
    return new MutableValueSignal<T>(initialValue);
}
