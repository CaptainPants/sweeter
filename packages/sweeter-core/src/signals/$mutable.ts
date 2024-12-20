import { MutableValueSignal } from './internal/Signal-implementations/MutableValueSignal.js';
import { type ReadWriteSignal } from './types.js';

/**
 * Create a new ReadWriteSignal signal with an initial value.
 * @param initialValue
 * @returns
 */
export function $mutable<T>(initialValue?: T): ReadWriteSignal<T>;
/**
 * Create a new ReadWriteSignal signal with an undefined initial value.
 * @param initialValue
 * @returns
 */
export function $mutable<T>(initialValue?: T): ReadWriteSignal<T> {
    if (arguments.length === 0) {
        // arguments.length == 0 means the optional parameter was not passed
        return new MutableValueSignal<T>();
    }
    return new MutableValueSignal<T>(initialValue);
}
