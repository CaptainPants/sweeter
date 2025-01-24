import { signalMarker, writableSignalMarker } from './internal/markers.js';
import {
    type ReadWriteSignal,
    type Signal,
    type WritableSignal,
} from './types.js';

export function isSignal(value: unknown): value is Signal<unknown> {
    return !!value && typeof value === 'object' && signalMarker in value;
}

export function isWritableSignal(
    value: unknown,
): value is WritableSignal<unknown> {
    return (
        !!value &&
        typeof value === 'object' &&
        writableSignalMarker in value &&
        !!value[writableSignalMarker]
    );
}

export function isReadWriteSignal(
    value: unknown,
): value is ReadWriteSignal<unknown> {
    return (
        !!value &&
        typeof value === 'object' &&
        signalMarker in value &&
        !!value[signalMarker] &&
        writableSignalMarker in value &&
        !!value[writableSignalMarker]
    );
}
