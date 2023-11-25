import type { SignalState } from './SignalState.js';
import { getSignalValueFromState, isEqualSignalState } from './SignalState.js';
import { announceSignalUsage, untrack } from './ambient.js';
import { ListenerSet } from './internal/ListenerSet.js';
import { signalMarker } from './internal/markers.js';
import type { Signal, SignalListener } from './types.js';

export abstract class SignalBase<T> implements Signal<T> {
    constructor(state: SignalState<T>) {
        this[signalMarker] = true;
        this.#state = state;
    }

    #state: SignalState<T>;
    #listeners = new ListenerSet<SignalListener<T>>();

    public [signalMarker]: true;

    public get value(): T {
        announceSignalUsage(this);
        return this.peek();
    }

    public peek(): T {
        return getSignalValueFromState(this.peekState());
    }

    public peekState(): SignalState<T> {
        this._peeking();
        return this.#state;
    }

    /**
     * Should never throw.
     * @param state
     */
    protected _updateAndAnnounce(state: SignalState<T>) {
        const previous = this.#state;

        if (isEqualSignalState(previous, state)) {
            return; // Don't announce the change if the values were equal
        }

        this.#state = state;
        this.#announceChange(previous, state);
    }

    protected _peeking(): void {
        // If its a calculated signal that has been marked as dirty, this will be called at the end of the current batch
    }

    #announceChange(previous: SignalState<T>, next: SignalState<T>) {
        const SignalBase_announceChange = () => {
            this.#listeners.announce(previous, next);
        };

        // Don't accidentally subscribe to signals used within listener callbacks, that would be dumb
        untrack(SignalBase_announceChange);
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
