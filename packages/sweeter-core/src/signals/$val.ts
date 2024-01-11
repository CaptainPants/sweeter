import { type Signal, type UnsignalAll } from './types.js';
import { isSignal } from './isSignal.js';
import { announceSignalUsage } from './ambient.js';
import { $calc } from './$calc.js';

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

export function $wrap<T>(value: T | Signal<T>): Signal<T> {
    return isSignal(value) ? value : $calc(() => value);
}

/**
 * Explicitly track a signal, ignoring what its actual value is.
 * @param value
 */
export function $recalcOnChange<T>(value: T | Signal<T>): void {
    if (isSignal(value)) {
        announceSignalUsage(value);
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

export function $valObjectValues<
    TObj extends Readonly<Record<string, unknown>>,
>(source: TObj): UnsignalAll<TObj> {
    const result = {} as Record<string, unknown>;

    for (const key of Object.keys(source)) {
        result[key] = $val(source[key]);
    }

    return result as UnsignalAll<TObj>;
}
