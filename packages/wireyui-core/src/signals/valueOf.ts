import type { Signal, UnsignalAll } from './types.js';
import { isSignal } from './isSignal.js';

/**
 * If the parameter is a signal, access the value via signal.value (and therefore subscribe), otherwise return the parameter unchanged.
 *
 * Use this with Props<T>.
 * @param value
 * @returns
 */
export function valueOf<T>(value: T | Signal<T>): T {
    return isSignal(value) ? value.value : value;
}

export function valueOfAll<TArgs extends readonly unknown[]>(
    values: [...TArgs],
): UnsignalAll<[...TArgs]> {
    return values.map((x) => valueOf(x)) as UnsignalAll<[...TArgs]>;
}
