export interface ExecutionContextLocal<T> {
    readonly current: T;

    replace(value: T): () => void;

    invokeWith(value: T, callback: () => void): void;
}
