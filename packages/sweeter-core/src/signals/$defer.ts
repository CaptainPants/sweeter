import { DeferredSignal } from './internal/DeferredSignal.js';
import { type Later, type Signal } from './types.js';

export function $defer<T>(inner: Signal<T>, later?: Later): Signal<T> {
    return new DeferredSignal(inner, later);
}
