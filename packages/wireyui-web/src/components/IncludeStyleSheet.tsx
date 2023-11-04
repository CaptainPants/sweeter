/* @jsxImportSource .. */

import type { Component } from '@captainpants/wireyui-core';
import type { GlobalStyleSheet } from '../styles/index.js';
import { WebRuntimeContext } from '../runtime/WebRuntime.js';

export interface IncludeStyleSheetProps {
    stylesheet: GlobalStyleSheet;
}

export const IncludeStyleSheet: Component<IncludeStyleSheetProps> = (
    { stylesheet },
    init,
) => {
    const runtime = init.getContext(WebRuntimeContext);

    init.subscribeToChanges(
        [stylesheet],
        ([stylesheet]) => {
            if (stylesheet) {
                return runtime.addStyleSheet(stylesheet);
            }
            return;
        },
        true,
    );

    return <></>;
};
