import { announceSignalUsage } from './ambient';
import { Signal, SignalListener } from './types';

export class SignalBase<T> implements Signal<T> {
    constructor(initialValue: T) {
        this.#value = initialValue;
    }

    #value: T;
    #listeners: Set<SignalListener<T>> = new Set();

    public get value(): T {
        announceSignalUsage(this);
        return this.#value;
    }

    public peek(): T {
        return this.#value;
    }

    public get anyListeners() {
        return this.#listeners.size > 0;
    }

    protected _set(value: T) {
        const previous = this.#value;
        this.#value = value;

        for (const listener of this.#listeners) {
            listener(previous, value);
        }
    }

    public listen(listener: SignalListener<T>): () => void {
        const count = this.#listeners.size;

        this.#listeners.add(listener);

        if (count === 1) {
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
