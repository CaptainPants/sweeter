import {
    PTOLEMY_IS_CONSTANT_SIGNAL,
    PTOLEMY_IS_SIGNAL,
    PTOLEMY_IS_WRITABLE_SIGNAL,
} from './internal/markers.js';
import { ConstantSignal } from './internal/Signal-implementations/ConstantSignal.js';
import {
    type ReadWriteSignal,
    type Signal,
    type WritableSignal,
} from './types.js';

export function isSignal(value: unknown): value is Signal<unknown> {
    return !!value && typeof value === 'object' && PTOLEMY_IS_SIGNAL in value;
}

export function isWritableSignal(
    value: unknown,
): value is WritableSignal<unknown> {
    return (
        !!value &&
        typeof value === 'object' &&
        PTOLEMY_IS_WRITABLE_SIGNAL in value &&
        !!value[PTOLEMY_IS_WRITABLE_SIGNAL]
    );
}

export function isReadWriteSignal(
    value: unknown,
): value is ReadWriteSignal<unknown> {
    return (
        !!value &&
        typeof value === 'object' &&
        PTOLEMY_IS_SIGNAL in value &&
        !!value[PTOLEMY_IS_SIGNAL] &&
        PTOLEMY_IS_WRITABLE_SIGNAL in value &&
        !!value[PTOLEMY_IS_WRITABLE_SIGNAL]
    );
}

export function isConstantSignal(
    value: unknown,
): value is ConstantSignal<unknown> {
    return (
        !!value &&
        typeof value === 'object' &&
        PTOLEMY_IS_SIGNAL in value &&
        PTOLEMY_IS_CONSTANT_SIGNAL in value
    );
}
