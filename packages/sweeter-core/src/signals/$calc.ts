import { type CalculatedSignalOptions, type Signal } from './types.js';
import { CalculatedSignal } from './internal/Signal-implementations.js';
import { isReadWriteSignal } from './isSignal.js';

export function $calc<T>(
    calculation: () => T,
    options?: CalculatedSignalOptions,
): Signal<T> {
    return new CalculatedSignal(calculation, options);
}

export function $constant<T>(value: T) {
    return $calc(() => value);
}

/**
 * Returns a read only promise linked to the source signal.
 * @param source
 * @returns
 */
export function $readonly<T>(source: Signal<T>) {
    if (!isReadWriteSignal(source)) {
        return source;
    }

    return $calc(() => source.value);
}
