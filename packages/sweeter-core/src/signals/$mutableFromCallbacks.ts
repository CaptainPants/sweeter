import { MutableCalculatedSignal } from './internal/MutableCalculatedSignal.js';
import type { ReadWriteSignal } from './types.js';

/**
 * Create a new ReadWriteSignal from the results of a calculation, that can apply updates using a mutater callback.
 * @param calculation
 * @param mutate
 * @returns
 */
export function $mutableFromCallbacks<T>(
    calculation: () => T,
    mutate: (value: T) => void,
): ReadWriteSignal<T> & { value: T } {
    return new MutableCalculatedSignal<T>(calculation, mutate);
}
