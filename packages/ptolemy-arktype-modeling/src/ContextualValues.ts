import { Signal } from '@serpentis/ptolemy-core';

import { type UnknownType } from './type/types.js';

export interface ContextualValueCalculationContext {
    ambient: Signal<AmbientValueCallback> | AmbientValueCallback;
    local:
        | Signal<LocalValueCallback | undefined>
        | LocalValueCallback
        | undefined;
}

export type ContextualValueCalculationCallback = (
    owner: Signal<UnknownType>,
    context: ContextualValueCalculationContext,
) => unknown;

/**
 * Return typeof notFound to indicate that there was no matching value.
 */
export type LocalValueCallback = (name: string) => unknown;

/**
 * Return typeof notFound to indicate that there was no matching value.
 */
export interface AmbientValueCallback {
    get: (name: string) => unknown;
    parent?: ((name: string) => unknown) | undefined;
}
