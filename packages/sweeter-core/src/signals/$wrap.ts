import { $constant, type Signal, isSignal } from './index.js';

export function $wrap<T>(value: T | Signal<T>): Signal<T> {
    return isSignal(value) ? value : $constant(value);
}
