import { SignalState } from './SignalState';

export type SignalListener<T> = (
    previous: SignalState<T>,
    next: SignalState<T>,
) => void;

export interface Signal<T> {
    readonly value: T;

    peek(): T;

    readonly anyListeners: boolean;

    listen(listener: SignalListener<T>): () => void;

    unlisten(listener: SignalListener<T>): void;
}
