import type { SignalState } from './SignalState.js';
import { getSignalValueFromState, isEqualSignalState } from './SignalState.js';
import { announceSignalUsage, untrack } from './ambient.js';
import { ListenerSet } from './internal/ListenerSet.js';
import type { Signal, SignalListener } from './types.js';

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
        return getSignalValueFromState(this.#state);
    }

    /**
     * Should never throw.
     * @param state
     */
    protected _set(state: SignalState<T>) {
        const previous = this.#state;

        if (isEqualSignalState(previous, state)) {
            return; // Don't announce the change if the values were equal
        }

        this.#state = state;
        this.#announceChange(previous, state);
    }

    #announceChange(previous: SignalState<T>, next: SignalState<T>) {
        // Don't accidentally subscribe to signals used within listener callbacks, that would be dumb
        untrack(() => {
            this.#listeners.announce(previous, next);
        });
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

    public clearListeners(): void {
        this.#listeners.clear();
    }
}
