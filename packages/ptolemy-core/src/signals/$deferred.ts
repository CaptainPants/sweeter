import { DeferredSignal } from './internal/Signal-implementations/DeferredSignal.js';
import { type CallbackDelayedRunner, type Signal } from './types.js';

export function $deferred<T>(
    inner: Signal<T>,
    later?: CallbackDelayedRunner,
): Signal<T> {
    return new DeferredSignal(inner, later);
}
