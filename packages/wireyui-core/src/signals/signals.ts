
export type SignalListener<T> = (previous: T, next: T) => void;

export interface Signal<T> {
    readonly value: T;

    listen(listener: SignalListener<T>): () => void;
}

export interface WritableSignal<T> extends Signal<T> {
    value: T;
}

export function signal<T>(initial: T): WritableSignal<T> {
    throw 'Not implemented';
}

export function calc<T>(initial: T): Signal<T> {
    throw 'Not implemented';
}

