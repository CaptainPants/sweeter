import { SignalState } from './SignalState.js';
import { announceSignalUsage } from './ambient.js';
import { WeakListenerSet } from './internal/WeakListenerSet.js';
import { Signal, SignalListener } from './types.js';

export class SignalBase<T> implements Signal<T> {
    constructor(state: SignalState<T>) {
        this.#state = state;
    }

    #state: SignalState<T>;
    #listeners = new WeakListenerSet<SignalListener<T>>();

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
        this.#listeners.announce(previous, next);
    }

    public listen(listener: SignalListener<T>): () => void {
        this.#listeners.add(listener);

        return () => {
            this.unlisten(listener);
        };
    }

    public unlisten(listener: SignalListener<T>): void {
        this.#listeners.remove(listener);
    }
}
