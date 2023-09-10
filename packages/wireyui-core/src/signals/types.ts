export type SignalListener<T> = (previous: T, next: T) => void;

export interface Signal<T> {
    readonly value: T;

    peek(): T;

    readonly anyListeners: boolean;

    listen(listener: SignalListener<T>): () => void;

    unlisten(listener: SignalListener<T>): void;
}
