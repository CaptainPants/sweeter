import { type CalculatedSignalOptions, type Signal } from './types.js';
import { CalculatedSignal } from './internal/Signal-implementations.js';

export function $calc<T>(
    calculation: () => T,
    options?: CalculatedSignalOptions,
): Signal<T> {
    return new CalculatedSignal(calculation, options);
}