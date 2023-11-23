/* @jsxImportSource .. */

import type { Component } from '@captainpants/sweeter-core';
import type { GlobalCssStylesheet } from '../styles/index.js';
import { getWebRuntime } from '../runtime/getWebRuntime.js';

export interface IncludeStylesheetProps {
    stylesheet: GlobalCssStylesheet;
}

export const IncludeStylesheet: Component<IncludeStylesheetProps> = (
    { stylesheet },
    init,
) => {
    const runtime = getWebRuntime();

    init.subscribeToChanges(
        [stylesheet],
        ([stylesheet]) => {
            if (stylesheet) {
                const remove = runtime.addStylesheet(stylesheet);

                return remove;
            }

            return undefined;
        },
        true,
    );

    return <></>;
};
