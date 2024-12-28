import { SignalBase } from './internal/Signal-implementations/SignalBase';
import { type InitiatedSignalState, type SignalState } from './SignalState';
import { type Signal } from './types';

export class SignalController<T> {
    #abort: AbortController;
    #signal: ControlledSignal<T>;

    constructor(initialState: SignalState<T>) {
        this.#abort = new AbortController();
        this.#signal = new ControlledSignal(this, initialState);
    }

    updateState(signalState: InitiatedSignalState<T>): void {
        if (this.#abort.signal.aborted) return;

        this.#signal[notifySymbol](signalState);
    }

    disconnect(): void {
        this.#abort.abort();
    }

    get isDisconnected(): boolean {
        return this.#abort.signal.aborted;
    }

    get signal(): Signal<T> {
        return this.#signal;
    }

    identify(...params: Parameters<Signal<T>['identify']>): this {
        this.#signal.identify(...params);
        return this;
    }
}

/** Private protocol for communicating from controller to signal */
const notifySymbol: unique symbol = Symbol('Update');

class ControlledSignal<T> extends SignalBase<T> {
    constructor(owner: SignalController<T>, initialState: SignalState<T>) {
        super(initialState);

        this.#owner = owner;
    }

    /**
     * This primarily exists to make sure that the controller is not garbage collected
     * as long as the signal itself does -- which is important in a chain of signals.
     */
    #owner: SignalController<T>;

    [notifySymbol](newState: SignalState<T>): void {
        this._updateAndAnnounce(newState);
    }
}
