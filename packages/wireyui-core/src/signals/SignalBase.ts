import { SignalState } from './SignalState';
import { announceSignalUsage } from './ambient';
import { Signal, SignalListener } from './types';

export class SignalBase<T> implements Signal<T> {
    constructor(state: SignalState<T>) {
        this.#state = state;
    }

    #state: SignalState<T>;
    #listeners: Set<SignalListener<T>> = new Set();

    public get value(): T {
        announceSignalUsage(this);
        return this.peek();
    }

    public peek(): T {
        if (this.#state.mode === 'ERROR') {
            throw this.#state.error;
        }
        return this.#state.value;
    }

    public get anyListeners() {
        return this.#listeners.size > 0;
    }

    /**
     * Should never throw.
     * @param state
     */
    protected _set(state: SignalState<T>) {
        const previous = this.#state;

        if (Object.is(previous, state)) {
            return; // Don't announce the change if the values were equal
        }

        this.#state = state;
        this.#announceChange(previous, state);
    }

    #announceChange(previous: SignalState<T>, next: SignalState<T>) {
        for (const listener of this.#listeners) {
            try {
                listener(previous, next);
            } catch (ex) {
                // A listener throwing an exception should not cause an error to be propagated
                // unfortunately this leaves us logging the error (console.error) and moving
                // on.
                console.error('Error in signal listener ', ex);
            }
        }
    }

    public listen(listener: SignalListener<T>): () => void {
        const count = this.#listeners.size;

        this.#listeners.add(listener);

        // Was 0, increased to 1
        if (count === 0) {
            this._firstListenerAttached();
        }

        return () => {
            this.unlisten(listener);
        };
    }

    public unlisten(listener: SignalListener<T>): void {
        const count = this.#listeners.size;

        this.#listeners.delete(listener);

        if (count == 1) {
            this._lastListenerDetached();
        }
    }

    protected _lastListenerDetached() {}

    protected _firstListenerAttached() {}
}
