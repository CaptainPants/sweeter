import { SignalListener } from "./types";

export class Signal<T> {
    constructor(initialValue: T) {
        this.#value = initialValue;
    }

    #value: T;
    #listeners: Set<SignalListener<T>> = new Set();

    public get value(): T
    {
        return this.#value;
    }

    protected _set(value: T) {
        this.#value = value;
    }

    public listen(listener: SignalListener<T>): () => void {
        this.#listeners.add(listener);

        return () => {
            this.#listeners.delete(listener);
        }
    }
}
