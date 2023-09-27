import { SignalState } from './SignalState.js';

export type SignalListener<T> = (
    previous: SignalState<T>,
    next: SignalState<T>,
) => void;

export interface Signal<T> {
    /**
     * Get the current value of the signal and subscribe for updates.
     */
    readonly value: T;

    /**
     * Get the current value of the signal without subscribing for updates.
     */
    peek(): T;

    /**
     * Add a callback to be invoked when the signal changes. This can optionally be a weak reference.
     * @param listener
     * @param strong default: true
     */
    listen(listener: SignalListener<T>, strong?: boolean): () => void;

    /**
     *
     * @param listener
     * @param strong default: true
     */
    unlisten(listener: SignalListener<T>, strong?: boolean): void;

    /**
     * Remove all listeners.
     */
    clearListeners(): void;
}

export interface MutableSignal<T> extends Signal<T> {
    value: T;
}
