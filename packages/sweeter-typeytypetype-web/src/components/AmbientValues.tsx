import {
    $calc,
    $val,
    type ComponentInit,
    type PropertiesMightBeSignals,
} from '@captainpants/sweeter-core';
import {
    notFound,
    type AmbientValueCallback,
} from '@captainpants/typeytypetype';

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

    const ambientValueCallback = $calc<AmbientValueCallback>(() => {
        const newCallbackResolved = $val(newCallback);
        const existingContextResolved = $val(existingContext);

        // Shortcut for the 'do nothing' flow variation
        if (!newCallbackResolved) {
            return existingContextResolved as AmbientValueCallback;
        }

        return {
            get: (name: string): unknown => {
                const result = newCallbackResolved.get(name);

                if (result !== notFound) {
                    return result;
                }

                return existingContextResolved.get(name);
            },
            parent: $val(existingContext).get,
        };
    });

    return AmbientValuesContext.invokeWith(ambientValueCallback, () => {
        return $calc(() => {
            return $val(children)?.();
        });
    });
}
