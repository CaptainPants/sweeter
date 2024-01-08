import {
    $calc,
    $peek,
    $val,
    type ComponentInit,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import { type AmbientValueCallback } from '@captainpants/typeytypetype';

import { AmbientValuesContext } from '../context/AmbientValuesContext.js';

export type AmbientValuesProps = PropertiesMightBeSignals<{
    callback: AmbientValueCallback | undefined;
    children?: () => JSX.Element;
}>;

export function AmbientValues(
    { callback: newCallback, children }: AmbientValuesProps,
    init: ComponentInit,
): JSX.Element {
    const existingContext = init.getContext(AmbientValuesContext);

    const context = () => {
        // Shortcut for the 'do nothing' flow variation
        if (!newCallback) {
            return existingContext;
        }

        const replacementCallback = (name: string): unknown => {
            const result = $peek(newCallback)?.get(name);

            if (result !== undefined) {
                return result;
            }

            return existingContext.ambientValueCallback?.(name) ?? undefined;
        };

        return {
            ambientValueCallback: replacementCallback,
        };
    };

    return AmbientValuesContext.invokeWith(
        { ambientValueCallback: context },
        () => {
            return $calc(() => {
                return $val(children)?.();
            });
        },
    );
}
