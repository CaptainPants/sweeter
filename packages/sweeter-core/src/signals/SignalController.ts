import {
    CalculatedSignal,
    MutableValueSignal,
} from './internal/Signal-implementations';
import { InitiatedSignalState, SignalState } from './SignalState';
import { Signal } from './types';

export class SignalController<T> {
    #handlers: ((newState: SignalState<T>) => void)[] = [];
    #abort: AbortController;
    #underlying: MutableValueSignal<T>;
    #readonlySignal: CalculatedSignal<T>;

    constructor(initialState: SignalState<T>) {
        this.#abort = new AbortController();
        this.#underlying = new MutableValueSignal(initialState);
        // Split this out just so the function object has a .name assigned
        const readonlyCalculation = () => this.#underlying.value;
        this.#readonlySignal = new CalculatedSignal(readonlyCalculation, {
            release: this.#abort.signal,
        });
    }

    updateState(signalState: InitiatedSignalState<T>): void {
        if (this.#abort.signal.aborted) return;

        this.#underlying.updateState(signalState);

        for (const handler of this.#handlers) {
            try {
                handler(signalState);
            } catch (ex) {
                console.error(
                    'Swallowed error in SignalController handlers',
                    ex,
                );
            }
        }
    }

    addListener(handler: (newState: SignalState<T>) => void): void {
        if (this.#abort.signal.aborted) return;

        this.#handlers.push(handler);
    }

    disconnect(): void {
        this.#abort.abort();
        this.#handlers = [];
    }

    get isDisconnected(): boolean {
        return this.#abort.signal.aborted;
    }

    get signal(): Signal<T> {
        return this.#readonlySignal;
    }
}
