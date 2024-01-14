import { type StackTrace } from '@captainpants/sweeter-utilities';
import {
    type signalMarker,
    type writableSignalMarker,
} from './internal/markers.js';

export type SignalState<T> =
    | { readonly mode: 'INITIALISING' }
    | { readonly mode: 'SUCCESS'; readonly value: T }
    | { readonly mode: 'ERROR'; readonly error: unknown };

export type SignalListener<T> = (
    previous: SignalState<T>,
    next: SignalState<T>,
) => void;

export interface Signal<T> {
    /**
     * Get the current value of the signal and subscribe for updates.
     */
    readonly value: T;

    readonly [signalMarker]: true;

    /**
     * Get the current value of the signal without subscribing for updates.
     */
    peek(): T;

    peekState(): SignalState<T>;

    readonly inited: boolean;

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

    readonly createdAtStack?: StackTrace;
}

export interface WritableSignal<T> {
    readonly [writableSignalMarker]: true;

    update(value: T): void; // You can't have a write only property so using a method
}

export interface ReadWriteSignal<T> extends Signal<T>, WritableSignal<T> {}

export type Unsignal<T> = T extends Signal<infer S> ? S : T;
export type UnsignalAll<
    T extends readonly unknown[] | Readonly<Record<string, unknown>>,
> = {
    [Key in keyof T]: Unsignal<T[Key]>;
};

export type CallbackDelayedRunner = (callback: () => void) => void;

export interface CalculatedSignalOptions {
    /**
     * If this AbortSignal is aborted then the calculated signal 'release' - meaning that it stops being updated when
     * its dependencies are updated.
     *
     * This is probably not that useful to regular users, but helpful when building infrastucture
     * and you e.g. want to invalidate a signal that is no longer relevant, but don't want accidental breakages down the chain.
     *
     * This was originally implemented for the For component.
     */
    release?: AbortSignal;
}
