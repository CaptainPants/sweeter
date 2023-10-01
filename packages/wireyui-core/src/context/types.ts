export interface ExecutionContextLocal<T> {
    readonly current: T;

    replace(value: T): Disposable;

    invoke(value: T, callback: () => void): void;
}
