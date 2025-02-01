import { announceMutatingSignal, announceSignalUsage } from '../../ambient.js';
import { SignalState } from '../../SignalState.js';
import { type ReadWriteSignal } from '../../types.js';
import { writableSignalMarker } from '../markers.js';

import { NormalSignalBase } from './NormalSignalBase.js';

export class MutableValueSignal<T>
    extends NormalSignalBase<T>
    implements ReadWriteSignal<T>
{
    constructor(value?: T) {
        super(
            arguments.length === 0 // Because undefined might be passed
                ? SignalState.init()
                : SignalState.success(value as T),
        );
    }

    public get [writableSignalMarker]() {
        return true as const;
    }

    override get value(): T {
        // Weirdly, if you don't override the getter as well you end up with an undefined result
        // so this just duplicates the code in SignalBase.value
        announceSignalUsage(this);
        return this.peek();
    }

    override set value(value: T) {
        this.#updateState(SignalState.success(value));
    }

    #updateState(state: SignalState<T>): void {
        // We COULD allow error values to be assigned
        // (by making this public)
        // but thats hard for MutableDerivedSignal and it
        // would be good to be consistent between
        // implementations of ReadWriteSignal
        announceMutatingSignal(this);
        super._updateAndAnnounce(state);
    }
}
