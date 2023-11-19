import { CalculatedSignal } from './CalculatedSignal.js';
import { announceMutatingSignal, announceSignalUsage } from '../ambient.js';
import { writableSignalMarker } from '../internal/markers.js';
import type { ReadWriteSignal } from '../types.js';

export class MutableCalculatedSignal<T>
    extends CalculatedSignal<T>
    implements ReadWriteSignal<T>
{
    constructor(calculation: () => T, mutate: (value: T) => void) {
        super(calculation);

        this.#mutate = mutate;
    }

    #mutate: (value: T) => void;

    override get value(): T {
        // Weirdly, if you don't override the getter as well you end up with an undefined result
        // so this just duplicates the code in SignalBase.value
        announceSignalUsage(this);
        return this.peek();
    }

    override set value(value: T) {
        announceMutatingSignal(this);
        this.#mutate(value);
    }

    update(value: T): void {
        this.value = value;
    }

    readonly [writableSignalMarker] = true;
}
