import { FilteredSignal } from './internal/Signal-implementations/FilteredSignal.js';
import { Signal, SignalUpdateValuesAreEqualCallback } from './types.js';

export function $filtered<T>(
    inner: Signal<T>,
    equals: SignalUpdateValuesAreEqualCallback<T>,
): Signal<T> {
    return new FilteredSignal(inner, equals);
}
