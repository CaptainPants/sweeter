import { type ReadonlySignalLike } from './ReadonlySignalLike.js';

export interface ContextualValueCalculationContext {
    ambient: AmbientValueCallback;
    local: LocalValueCallback | undefined;
}

export type ContextualValueCalculationCallback<T> = (
    owner: ReadonlySignalLike<T>,
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
    Visible: '$Visible',
};
