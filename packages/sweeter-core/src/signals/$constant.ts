import { DerivedSignal } from './internal/Signal-implementations/DerivedSignal.js';

export function $constant<T>(value: T) {
    return new DerivedSignal(() => value);
}
