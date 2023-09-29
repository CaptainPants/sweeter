import { Signal, isSignal } from './index.js';

/**
 * If the parameter is a signal, call .value, otherwise return the parameter.
 *
 * Use this with Props<T>.
 * @param value
 * @returns
 */
export function value<T>(value: T | Signal<T>): T {
    return isSignal(value) ? value.value : value;
}
