import { SignalListener } from './types';

export class Signal<T> {
    constructor(initialValue: T) {
        this.#value = initialValue;
    }

    #value: T;
    #listeners: Set<SignalListener<T>> = new Set();

    public get value(): T {
        return this.#value;
    }

    protected _set(value: T) {
        this.#value = value;
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

    protected _lastListenerDetached() {

    }

    protected _firstListenerAttached() {

    }
}
