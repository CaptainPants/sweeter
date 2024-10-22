/**
 * Represents a value that has not yet been calculated.
 *
 * Intentionally matches a subset of the ReadonlySignal<T> interface
 */
export interface ReadonlySignalLike<T> {
    readonly value: T;
}
