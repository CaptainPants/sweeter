import { findProperty } from '../internal/findProperty.js';
import { MutableSignal, Signal } from './types.js';

export function isSignal(value: unknown): value is Signal<unknown> {
    return typeof value === 'object' && value !== null && 'value' in value;
}

export function isMutableSignal(
    value: unknown,
): value is MutableSignal<unknown> {
    if (!isSignal(value)) {
        return false;
    }

    const prop = findProperty(value, 'value');
    return prop?.writable || prop?.set !== undefined;
}
