import { SignalState } from './SignalState.js';

export type SignalListener<T> = (
    previous: SignalState<T>,
    next: SignalState<T>,
) => void;

export interface Signal<T> {
    readonly value: T;

    peek(): T;

    listen(listener: SignalListener<T>): () => void;

    unlisten(listener: SignalListener<T>): void;
}

export interface MutableSignal<T> extends Signal<T> {
    value: T;
}
