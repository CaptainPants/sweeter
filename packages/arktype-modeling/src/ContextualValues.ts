import { type ReadonlySignalLike } from './ReadonlySignalLike.js';
import { Type } from 'arktype';

export interface ContextualValueCalculationContext {
    ambient: ReadonlySignalLike<AmbientValueCallback> | AmbientValueCallback;
    local:
        | ReadonlySignalLike<LocalValueCallback | undefined>
        | LocalValueCallback
        | undefined;
}

export type ContextualValueCalculationCallback<TZodType extends Type> = (
    owner: Type['infer'],
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
