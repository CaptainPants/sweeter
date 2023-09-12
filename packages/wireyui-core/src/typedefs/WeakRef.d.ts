declare global {
    class WeakRef<T> {
        constructor(target: T);

        deref(): T | undefined;
    }
}

export {};
