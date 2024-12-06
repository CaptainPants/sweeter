import { SignalBase } from './SignalBase.js';
import { announceMutatingSignal, announceSignalUsage } from '../../ambient.js';
import { writableSignalMarker } from '../markers.js';
import { type ReadWriteSignal } from '../../types.js';
import { SignalState } from '../../SignalState.js';

export class MutableValueSignal<T>
    extends SignalBase<T>
    implements ReadWriteSignal<T>
{
    constructor(initialState: SignalState<T>) {
        super(initialState);
    }

    readonly [writableSignalMarker] = true;

    override get value(): T {
        // Weirdly, if you don't override the getter as well you end up with an undefined result
        // so this just duplicates the code in SignalBase.value
        announceSignalUsage(this);
        return this.peek();
    }

    override set value(value: T) {
        this.updateState(SignalState.success(value));
    }

    update(value: T): void {
        this.updateState(SignalState.success(value));
    }

    updateState(state: SignalState<T>): void {
        announceMutatingSignal(this);
        super._updateAndAnnounce(state);
    }
}
