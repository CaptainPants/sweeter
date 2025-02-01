/* @jsxImportSource .. */

import {
    $derived,
    $val,
    type Component,
    type MightBeSignal,
    type Signal,
} from '@serpentis/ptolemy-core';
import { arrayExcept } from '@serpentis/ptolemy-utilities';

import { getWebRuntime } from '../runtime/getWebRuntime.js';
import {
    type AbstractGlobalCssStylesheet,
    type StylesheetInclude,
} from '../styles/index.js';

export interface IncludeStylesheetProps {
    stylesheet: StylesheetInclude;
};

export const IncludeStylesheet: Component<IncludeStylesheetProps> = (
    { stylesheet },
    init,
) => {
    const webRuntime = getWebRuntime();

    let previousTime: AbstractGlobalCssStylesheet[] | undefined;

    const flattened = flatten(stylesheet);

    // Remember that this is called on mount as well as when the subscribed signals change.
    init.trackSignals([flattened], ([thisTime]) => {
        if (previousTime) {
            const added = arrayExcept(thisTime, previousTime);
            const removed = arrayExcept(previousTime, thisTime);

            for (const addedItem of added) {
                webRuntime.addStylesheet(addedItem);
            }
            for (const removedItem of removed) {
                webRuntime.removeStylesheet(removedItem);
            }
        } else {
            for (const addedItem of thisTime) {
                webRuntime.addStylesheet(addedItem);
            }
        }

        previousTime = thisTime;
    });

    init.onUnMount(() => {
        if (previousTime) {
            for (const removedItem of previousTime) {
                webRuntime.removeStylesheet(removedItem);
            }
        }
    });

    return <></>;
};

function flatten(
    value: MightBeSignal<StylesheetInclude>,
): Signal<AbstractGlobalCssStylesheet[]> {
    return $derived(() => {
        value = $val(value);

        if (Array.isArray(value)) {
            return value;
        } else {
            return [value];
        }
    });
}
