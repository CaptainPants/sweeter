import type { Signal, UnsignalAll } from './types.js';
import { isSignal } from './isSignal.js';

/**
 * If the parameter is a signal, access the value via signal.value (and therefore subscribe), otherwise return the parameter unchanged.
 *
 * Use this with Props<T>.
 * @param value
 * @returns
 */
export function $val<T>(value: T | Signal<T>): T {
    return isSignal(value) ? value.value : value;
}
/**
 * Explicitly track a signal, ignoring what its actual value is.
 * @param value
 */
export function $track<T>(value: T | Signal<T>): void {
    if (isSignal(value)) {
        const _ = value.value;
    }
}
export function $peek<T>(value: T | Signal<T>): T {
    return isSignal(value) ? value.peek() : value;
}

export function $valEach<TArgs extends readonly unknown[]>(
    values: [...TArgs],
): UnsignalAll<[...TArgs]> {
    return values.map((x) => $val(x)) as UnsignalAll<[...TArgs]>;
}
