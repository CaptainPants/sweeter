
export type SignalListener<T> = (previous: T, next: T) => void;