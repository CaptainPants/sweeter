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
 * Note that returning undefined means 'not found'. If you need a nully value you need to use 'null' or a special case object.
 */
export type LocalValueCallback = (name: string) => unknown;

/**
 * Note that returning undefined means 'not found'. If you need a nully value you need to use 'null' or a special case object.
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
