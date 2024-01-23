import { type StackTrace } from '@captainpants/sweeter-utilities';
import {
    type signalMarker,
    type writableSignalMarker,
} from './internal/markers.js';

export type InitializedSignalState<T> =
    | { readonly mode: 'SUCCESS'; readonly value: T }
    | { readonly mode: 'ERROR'; readonly error: unknown };

export type SignalState<T> =
    | { readonly mode: 'INITIALISING' }
    | InitializedSignalState<T>;

export type SignalListener<T> = (
    previous: SignalState<T>,
    next: SignalState<T>,
) => void;

export interface Signal<T> {
    /**
     * Get the current value of the signal and subscribe for updates. If the result of the signal
     * is an exception, it is rethrown.
     */
    readonly value: T;

    /**
     * Get the current value of the signal without subscribing for updates. If the result of the signal
     * is an exception, it is rethrown.
     */
    peek(): T;

    /**
     * Gets the current state of the signal, which might be an exception.
     */
    peekState(): InitializedSignalState<T>;

    /**
     * Use this to check if a signal has been initialized. This can be useful in a $calc that references itself.
     */
    readonly inited: boolean;

    /**
     * Add a callback to be invoked when the signal's value changes. This can optionally be a weak reference.
     * @param listener
     * @param strong default: true
     */
    listen(listener: SignalListener<T>, strong?: boolean): () => void;

    /**
     * Remove a callback that has previously been registered.
     * @param listener
     * @param strong default: true
     */
    unlisten(listener: SignalListener<T>, strong?: boolean): void;

    /**
     * Remove all listeners.
     */
    clearListeners(): void;

    // == DEBUGGING ==

    /**
     * Globally unique id of signal, used only for debugging.
     */
    readonly id: number;

    readonly [signalMarker]: true;

    /**
     * If enabled, this will contain a stack trace created in the constructor of the signature, allowing
     * you to work out where the signal was created.
     */
    readonly createdAtStack?: StackTrace;

    /**
     * Gets a JSON tree of dependents of the current signal.
     */
    debugGetListenerTree(): DebugDependencyNode;
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

export type DebugDependencyNode =
    | {
          type: 'signal';
          signalId: number;
          state: unknown;
          dependents: DebugDependencyNode[];
          signalCreatedAtStack: string[] | undefined;
      }
    | {
          type: 'listener';
          listener: () => void;
          addedAtStack: string[];
      };
