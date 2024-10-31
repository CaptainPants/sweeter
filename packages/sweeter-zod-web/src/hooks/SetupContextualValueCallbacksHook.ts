import {
    notFound,
    type AmbientValueCallback,
    type ContextualValueCalculationContext,
    type LocalValueCallback,
} from '@captainpants/zod-modeling';

import {
    type Signal,
    type ComponentInit,
    $peek,
    $calc,
    $val,
} from '@captainpants/sweeter-core';
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
    local:
        | CalculateContextualValueCallback
        | undefined
        | Signal<CalculateContextualValueCallback | undefined>,
    ambient:
        | CalculateContextualValueCallback
        | Signal<CalculateContextualValueCallback>,
): {
    local: Signal<LocalValueCallback>;
    ambient: Signal<AmbientValueCallback>;
} {
    const parentAmbient = init.getContext(AmbientValuesContext);

    const results = $calc(() => {
        const localResolved = $val(local);
        const ambientResolved = $val(ambient);
        const parentAmbientResolved = $val(parentAmbient);

        const localResult = (name: string): unknown => {
            try {
                --depth;
                if (depth <= 0) {
                    throw descend.error();
                }

                if (!localResolved) {
                    return notFound;
                }

                return localResolved(name, {
                    local: localResult,
                    // Circular reference here
                    ambient: $peek(ambientResult),
                });
            } finally {
                ++depth;
            }
        };

        const ambientResult: AmbientValueCallback = {
            get: (name: string): unknown => {
                try {
                    --depth;
                    if (depth <= 0) {
                        throw descend.error();
                    }

                    const thisLevel = ambientResolved(name, {
                        local: localResult,
                        // Circular reference here AND reference to self
                        ambient: $peek(ambientResult),
                    });

                    if (thisLevel !== notFound) {
                        return thisLevel;
                    }

                    return parentAmbientResolved.get(name);
                } finally {
                    ++depth;
                }
            },
            parent: parentAmbientResolved
                ? parentAmbientResolved.get
                : undefined,
        };

        return { localResult, ambientResult };
    });

    // All memoized so should never trigger changes
    const localResult = $calc(() => results.value.localResult);
    const ambientResult = $calc(() => results.value.ambientResult);

    return {
        local: localResult,
        ambient: ambientResult,
    };
}
