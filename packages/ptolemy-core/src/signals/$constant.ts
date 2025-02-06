import { isSignal } from './isSignal.js';
import { ConstantSignal } from './internal/Signal-implementations/ConstantSignal.js';
import { Signal } from './types.js';

// These values show up more often than any other, so for
// performance reasons we'll reuse the same instance.
// Remember that ConstantSignals don't announce themselves
// to dependency tracking because they can't change.
const wellKnown = new Map<unknown, Signal<unknown>>(
    [
        [0, new ConstantSignal(0)],
        [true, new ConstantSignal(true)],
        [false, new ConstantSignal(false)],
        [null, new ConstantSignal(null)],
        [undefined, new ConstantSignal(undefined)],
        ['', new ConstantSignal('')]
    ]
);

/**
 * Takes a value that might be a signal, and if it is not, wrap it in a $constant.
 * Use this in interfaces that require a signal, often with prop values passed via MightBeSignals.
 */
export function $wrap<T>(value: T | Signal<T>): Signal<T> {
    if (isSignal(value)){
        return value;
    }

    return $constant(value);
}

/**
 * Takes a value that might be a signal, and if it is not, wrap it in a $constant.
 * Use this in interfaces that require a signal, often with prop values passed via MightBeSignals.
 */
export function $constant<T>(value: T): Signal<T> {
    const found = wellKnown.get(value);
    if (found) {
        return found as Signal<T>;
    }

    return new ConstantSignal<T>(value);
}