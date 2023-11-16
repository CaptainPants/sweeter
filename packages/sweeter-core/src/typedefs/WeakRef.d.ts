declare global {
    /**
     * VSCode doesn't find the built-in definitions for this (although tsc builds correctly)
     */
    class WeakRef<T> {
        constructor(target: T);

        deref(): T | undefined;
    }
}

export {};
