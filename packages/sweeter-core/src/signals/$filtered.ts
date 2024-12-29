import { FilteredSignal } from './internal/Signal-implementations/FilteredSignal';
import { Signal, SignalUpdateValuesAreEqualCallback } from './types';

export function $filtered<T>(
    inner: Signal<T>,
    equals: SignalUpdateValuesAreEqualCallback<T>,
): Signal<T> {
    return new FilteredSignal(inner, equals);
}
