export interface ExecutionContextLocal<T> {
    readonly current: T;

    replace(value: T): () => void;

    invoke(value: T, callback: () => void): void;
}
