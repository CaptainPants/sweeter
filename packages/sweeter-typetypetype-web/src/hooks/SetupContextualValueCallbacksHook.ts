import {
    notFound,
    type AmbientValueCallback,
    type ContextualValueCalculationContext,
    type LocalValueCallback,
} from '@captainpants/typeytypetype';

import {
    type Signal,
    type ComponentInit,
    $peek,
    $calc,
    $recalcOnChange,
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
        $recalcOnChange(local);
        $recalcOnChange(ambient);

        const localResult = (name: string): unknown => {
            try {
                --depth;
                if (depth <= 0) {
                    throw descend.error();
                }

                const localResolved = $peek(local);

                if (!localResolved) {
                    return notFound;
                }

                return localResolved(name, {
                    local: localResult,
                    ambient: $peek(ambientResult),
                });
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

                const thisLevel = $peek(ambient)(name, {
                    local: $peek(localResult),
                    ambient: $peek(ambientResult),
                });

                if (thisLevel !== notFound) {
                    return thisLevel;
                }

                return parentAmbient.ambientValueCallback(name);
            } finally {
                ++depth;
            }
        };

        return { localResult, ambientGet };
    });

    // All memoized so should never trigger changes
    const localResult = $calc(() => results.value.localResult);
    const ambientGet = $calc(() => results.value.ambientGet);

    const ambientResult: Signal<AmbientValueCallback> = $calc(() => {
        return {
            get: ambientGet.value,
            parent: parentAmbient.ambientValueCallback,
        };
    });

    return {
        local: localResult,
        ambient: ambientResult,
    };
}
