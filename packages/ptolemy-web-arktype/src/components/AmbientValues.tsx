import {
    type AmbientValueCallback,
    notFound,
} from '@serpentis/ptolemy-arktype-modeling';
import {
    $derived,
    $insertLocation,
    $val,
    type Component,
} from '@serpentis/ptolemy-core';

import { AmbientValuesContext } from '../context/AmbientValuesContext.js';

export type AmbientValuesProps = {
    callback: AmbientValueCallback | undefined;
    children?: () => JSX.Element;
};

export const AmbientValues: Component<AmbientValuesProps> = (
    { callback: newCallback, children },
    init,
) => {
    const existingContext = init.getContext(AmbientValuesContext);

    const ambientValueCallback = $derived<AmbientValueCallback>(() => {
        const newCallbackResolved = newCallback.value;
        const existingContextResolved = $val(existingContext);

        // Shortcut for the 'do nothing' flow variation
        if (!newCallbackResolved) {
            return existingContextResolved;
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

    return AmbientValuesContext.invokeWith(
        ambientValueCallback,
        $insertLocation(),
        () => {
            // $derived is here is partly to capture the execution context (which includes the AmbientValuesContext)
            return $derived(() => {
                return $val(children)?.();
            });
        },
    );
};
