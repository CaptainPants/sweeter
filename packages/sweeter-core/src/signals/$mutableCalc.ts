import { MutableCalculatedSignal } from './internal/MutableCalculatedSignal.js';
import type { ReadWriteSignal } from './types.js';

export function $mutableCalc<T>(
    calculation: () => T,
    mutate: (value: T) => void,
): ReadWriteSignal<T> & { value: T } {
    return new MutableCalculatedSignal<T>(calculation, mutate);
}
