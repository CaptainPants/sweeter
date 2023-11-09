/* @jsxImportSource .. */

import type { Component } from '@captainpants/wireyui-core';
import type { GlobalStyleSheet } from '../styles/index.js';
import type { DocumentStyleSheetHandle } from '../runtime/WebRuntime.js';
import { WebRuntimeContext } from '../runtime/WebRuntime.js';

export interface IncludeStyleSheetProps {
    stylesheet: GlobalStyleSheet;
}

export const IncludeStyleSheet: Component<IncludeStyleSheetProps> = (
    { stylesheet },
    init,
) => {
    const runtime = init.getContext(WebRuntimeContext);

    let handle: DocumentStyleSheetHandle | undefined;

    init.subscribeToChanges(
        [stylesheet],
        ([stylesheet]) => {
            if (handle) {
                if (stylesheet) {
                    handle.update(stylesheet);
                } else {
                    handle.remove();
                }
            } else {
                if (stylesheet) {
                    handle = runtime.addStyleSheet(stylesheet);
                }
            }
            return;
        },
        true,
    );

    init.onUnMount(() => {
        handle?.remove();
    });

    return <></>;
};
