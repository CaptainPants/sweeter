import { SignalState } from './SignalState.js';

export type SignalListener<T> = (
    previous: SignalState<T>,
    next: SignalState<T>,
) => void;

export interface Signal<T> {
    readonly value: T;

    peek(): T;

    /**
     *
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
}

export interface MutableSignal<T> extends Signal<T> {
    value: T;
}
