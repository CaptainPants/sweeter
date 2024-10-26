import { $constant, $val, Signal, isSignal } from ".";

export function $wrap<T>(value: T | Signal<T>) {
    return isSignal(value) ? value : $constant(value);
}