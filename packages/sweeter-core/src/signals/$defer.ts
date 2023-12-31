import { DeferredSignal } from './internal/Signal-implementations.js';
import { type CallbackDelayedRunner, type Signal } from './types.js';

export function $defer<T>(
    inner: Signal<T>,
    later?: CallbackDelayedRunner,
): Signal<T> {
    return new DeferredSignal(inner, later);
}
