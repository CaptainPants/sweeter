import { mutableSignalMarker, signalMarker } from './internal/markers.js';
import type { MutableSignal, Signal } from './types.js';

export function isSignal(value: unknown): value is Signal<unknown> {
    return !!value && Object.hasOwn(value, signalMarker);
}

export function isMutableSignal(
    value: unknown,
): value is MutableSignal<unknown> {
    return !!value && Object.hasOwn(value, mutableSignalMarker);
}
