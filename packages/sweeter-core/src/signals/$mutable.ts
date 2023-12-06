import { MutableValueSignal } from './internal/MutableValueSignal.js';
import { type ReadWriteSignal } from './types.js';

/**
 * Create a new ReadWriteSignal signal with an initial value.
 * @param initialValue
 * @returns
 */
export function $mutable<T>(initialValue: T): ReadWriteSignal<T> & { value: T };
/**
 * Create a new ReadWriteSignal signal with an undefined initial value.
 * @param initialValue
 * @returns
 */
export function $mutable<TOrUndefined>(): ReadWriteSignal<
    TOrUndefined | undefined
> & { value: TOrUndefined extends undefined ? never : TOrUndefined };
export function $mutable<T>(
    initialValue?: T,
): ReadWriteSignal<T> & { value: T } {
    return new MutableValueSignal<T>(initialValue as T);
}
