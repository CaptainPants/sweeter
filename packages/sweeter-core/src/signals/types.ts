import { type StackTrace } from '@captainpants/sweeter-utilities';
import {
    type signalMarker,
    type writableSignalMarker,
} from './internal/markers.js';
import { type SignalState } from './SignalState.js';

export type SignalListener<T> = (
    next: SignalState<T>,
    previous: SignalState<T>,
    trigger: Signal<unknown> | undefined
) => void;

/**
 * Basically Signal<T> without the .value property, so that we can share all other functionality between Signal<T> and
 * ReadWriteSignal<T>, but have a different specification for .value. This is mostly because Unfortunately you cannot
 * expand a readonly property on a base interface to a read/write property on a derived interface.
 */
export interface SignalCommon<T> {
    /**
     * Get the current value of the signal without subscribing for updates. If the result of the signal
     * is an exception, it is rethrown.
     */
    peek(): T;

    /**
     * Gets the current state of the signal, which might be an exception.
     * @param ensureInit defaults to true - ensure that the signal is inialized
     */
    peekState(ensureInit?: boolean): SignalState<T>;

    /**
     * Use this to check if a signal has been initialized. This can be useful in a $derive that references itself.
     */
    readonly inited: boolean;
    readonly failed: boolean;

    /**
     * Add a callback to be invoked when the signal's value changes.
     * @param listener
     */
    listen(listener: SignalListener<T>): () => void;

    /**
     * Add a callback to be invoked when the signal's value changes. The reference to listener is held via WeakRef.
     * @param listener
     */
    listenWeak(listener: SignalListener<T>): () => void;

    /**
     * Remove a callback that has previously been registered.
     * @param listener
     */
    unlisten(listener: SignalListener<T>): void;

    /**
     * Remove a callback that has previously been registered.
     * @param listener
     */
    unlistenWeak(listener: SignalListener<T>): void;

    /**
     * Remove all listeners.
     */
    clearListeners(): void;

    // == DEBUGGING ==

    /**
     * Globally unique id of signal, used only for debugging.
     */
    readonly id: number;

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

export interface Signal<T> extends SignalCommon<T> {
    readonly [signalMarker]: true;

    /**
     * Get the current value of the signal and subscribe for updates. If the result of the signal
     * is an exception, it is rethrown.
     */
    readonly value: T;

    identify(name: string, sourceFile?: string, sourceMethod?: string): this;

    getDebugIdentity(): string;
}

export interface WritableSignal<T> extends SignalCommon<T> {
    readonly [writableSignalMarker]: true;

    // there is no way to mark this as write only, but logically it is
    value: T;
}

export interface ReadWriteSignal<T> extends Signal<T>, WritableSignal<T> {
    readonly [signalMarker]: true;

    value: T;
}

export type Unsignal<T> = T extends Signal<infer S> ? S : T;
export type UnsignalAll<
    T extends readonly unknown[] | Readonly<Record<string, unknown>>,
> = {
    [Key in keyof T]: Unsignal<T[Key]>;
};

export type CallbackDelayedRunner = (callback: () => void) => void;

export interface DerivedSignalOptions {
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
          signal: Signal<unknown>;
          dependents: DebugDependencyNode[];
      }
    | {
          type: 'listener';
          listener: Function;
          addedAtStack: string[] | undefined;
      };
