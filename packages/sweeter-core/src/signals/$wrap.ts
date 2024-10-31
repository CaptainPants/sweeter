import { $constant, $val, type Signal, isSignal } from './index.js';

export function $wrap<T>(value: T | Signal<T>) {
    return isSignal(value) ? value : $constant(value);
}
