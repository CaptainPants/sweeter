/* @jsxImportSource .. */

import {
    $val,
    type Signal,
    type Component,
    type MightBeSignal,
    type PropertiesMightBeSignals,
    $calc,
} from '@captainpants/sweeter-core';
import {
    type AbstractGlobalCssStylesheet,
    type StylesheetInclude,
} from '../styles/index.js';
import { getWebRuntime } from '../runtime/getWebRuntime.js';
import { arrayExcept } from '@captainpants/sweeter-utilities';

export type IncludeStylesheetProps = PropertiesMightBeSignals<{
    stylesheet: StylesheetInclude;
}>;

export const IncludeStylesheet: Component<IncludeStylesheetProps> = (
    { stylesheet },
    init,
) => {
    const webRuntime = getWebRuntime();

    let previousTime: AbstractGlobalCssStylesheet[] | undefined;

    const flattened = flatten(stylesheet);

    init.subscribeToChangesWhileMounted(
        [flattened],
        ([thisTime]) => {
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
        },
        true,
    );

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
    return $calc(() => {
        value = $val(value);

        if (Array.isArray(value)) {
            return value;
        } else {
            return [value];
        }
    });
}
