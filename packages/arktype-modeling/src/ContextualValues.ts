import { type ReadonlySignalLike } from './ReadonlySignalLike.js';
import { type UnknownType } from './type/types.js';

export interface ContextualValueCalculationContext {
    ambient: ReadonlySignalLike<AmbientValueCallback> | AmbientValueCallback;
    local:
        | ReadonlySignalLike<LocalValueCallback | undefined>
        | LocalValueCallback
        | undefined;
}

export type ContextualValueCalculationCallback = (
    owner: UnknownType,
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

export const StandardLocalValues = {
    /**
     * Controls visibility of a property.
     */
    Visible: 'property:visible',
};
