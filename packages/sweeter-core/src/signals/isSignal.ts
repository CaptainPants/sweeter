import { writableSignalMarker, signalMarker } from './internal/markers.js';
import {
    type ReadWriteSignal,
    type Signal,
    type WritableSignal,
} from './types.js';

export function isSignal(value: unknown): value is Signal<unknown> {
    return !!value && Object.hasOwn(value, signalMarker);
}

export function isWritableSignal(
    value: unknown,
): value is WritableSignal<unknown> {
    return !!value && Object.hasOwn(value, writableSignalMarker);
}

export function isReadWriteSignal(
    value: unknown,
): value is ReadWriteSignal<unknown> {
    return (
        !!value &&
        Object.hasOwn(value, signalMarker) &&
        Object.hasOwn(value, writableSignalMarker)
    );
}
