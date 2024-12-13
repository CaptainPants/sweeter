import { $constant, type Signal, isSignal } from './index.js';

/**
 * Ensure that the value is a signal. If it is not already, wrap it in a $constant.
 * @param value
 * @returns
 */
export function $wrap<T>(value: T | Signal<T>): Signal<T> {
    return isSignal(value) ? value : $constant(value);
}
