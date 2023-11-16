import type { SignalState } from './SignalState.js';
import type { signalMarker, writableSignalMarker } from './internal/markers.js';

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

    peekState(): SignalState<T>;

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

    readonly [signalMarker]: true;
}

export interface WritableSignal<T> {
    update(value: T): void; // You can't have a write only property so using a method

    readonly [writableSignalMarker]: true;
}

export interface ReadWriteSignal<T> extends Signal<T>, WritableSignal<T> {
    // Non-readonly version of .value for convenience
    value: T;
}

export type Unsignal<T> = T extends Signal<infer S> ? S : T;
export type UnsignalAll<T extends readonly unknown[]> = {
    [Key in keyof T]: Unsignal<T[Key]>;
};
