import { ConstantSignal } from './internal/Signal-implementations/ConstantSignal.js';

export function $constant<T>(value: T) {
    return new ConstantSignal(() => value);
}
