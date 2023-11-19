import { type Signal } from './types.js';
import { CalculatedSignal } from './internal/CalculatedSignal.js';

export function $calc<T>(calculation: () => T): Signal<T> {
    return new CalculatedSignal(calculation);
}
