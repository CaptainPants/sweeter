import {
    type AmbientValueCallback,
    type ContextualValueCalculationContext,
    type LocalValueCallback,
} from '@captainpants/typeytypetype';

import { type ComponentInit } from '@captainpants/sweeter-core';
import { descend } from '@captainpants/sweeter-utilities';

import { AmbientValuesContext } from '../context/AmbientValuesContext.js';

let depth = descend.defaultDepth;

type CalculateContextualValueCallback = (
    name: string,
    context: ContextualValueCalculationContext,
) => unknown;

/**
 * Add callbacks into the ambient/local chain. Ambient callbacks should call all the way back to root, whereas locals should only travel from type to property and then end.
 *
 * Make sure to make the functions you pass to this stable, otherwise the entire subtree will re-render each time the containing component renders.
 * @param local This should only be provided from a property to a model so that values can be specified on the type and overridden on the property. Otherwise this should be undefined.
 * @param ambient Ambient value callback to add into the chain (pass this to AmbientValues callback={xxx}).
 * @returns
 */
export function SetupContextualValueCallbacksHook(
    init: ComponentInit,
    local: CalculateContextualValueCallback | undefined,
    ambient: CalculateContextualValueCallback,
): { local: LocalValueCallback; ambient: AmbientValueCallback } {
    const parentAmbient = init.getContext(AmbientValuesContext);

    // All memoized so should never trigger changes
    const localResult = (name: string): unknown => {
        try {
            --depth;
            if (depth <= 0) {
                throw descend.error();
            }

            return (
                local?.(name, {
                    local: localResult,
                    ambient: ambientResult,
                }) ?? undefined
            );
        } finally {
            ++depth;
        }
    };

    const ambientGet = (name: string): unknown => {
        try {
            --depth;
            if (depth <= 0) {
                throw descend.error();
            }

            const thisLevel = ambient(name, {
                local: localResult,
                ambient: ambientResult,
            });

            if (thisLevel !== undefined) {
                return thisLevel;
            }

            return parentAmbient.ambientValueCallback(name);
        } finally {
            ++depth;
        }
    };

    const ambientResult: AmbientValueCallback = {
        get: ambientGet,
        parent: parentAmbient.ambientValueCallback,
    };

    return {
        local: localResult,
        ambient: ambientResult,
    };
}
