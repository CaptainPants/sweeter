import { SignalState } from './SignalState.js';
import { announceSignalUsage } from './ambient.js';
import { ListenerSet } from './internal/ListenerSet.js';
import { Signal, SignalListener } from './types.js';

export class SignalBase<T> implements Signal<T> {
    constructor(state: SignalState<T>) {
        this.#state = state;
    }

    #state: SignalState<T>;
    #listeners = new ListenerSet<SignalListener<T>>();

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

    public listen(listener: SignalListener<T>, strong = true): () => void {
        this.#listeners.add(listener, strong);

        return () => {
            this.unlisten(listener, strong);
        };
    }

    public unlisten(listener: SignalListener<T>, strong = true): void {
        this.#listeners.remove(listener, strong);
    }
}
