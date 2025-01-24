import { isSignal, type Signal } from './index.js';
import { DerivedSignal } from './internal/Signal-implementations/DerivedSignal.js';

/**
 * Ensure that the value is a signal. If it is not already, wrap it in a $constant.
 * @param value
 * @returns
 */
export function $wrap<T>(value: T | Signal<T>): Signal<T> {
    return isSignal(value) ? value : new DerivedSignal(() => value);
}
