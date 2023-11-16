/* @jsxImportSource .. */

import type { Component } from '@captainpants/sweeter-core';
import type { AbstractGlobalCssStylesheet } from '../styles/index.js';
import type { DocumentStylesheetHandle } from '../runtime/WebRuntimeContext.js';
import { WebRuntimeContext } from '../runtime/WebRuntimeContext.js';

export interface IncludeStylesheetProps {
    stylesheet: AbstractGlobalCssStylesheet;
}

export const IncludeStylesheet: Component<IncludeStylesheetProps> = (
    { stylesheet },
    init,
) => {
    const runtime = init.getContext(WebRuntimeContext);

    let handle: DocumentStylesheetHandle | undefined;

    init.subscribeToChanges(
        [stylesheet],
        ([stylesheet]) => {
            if (handle) {
                handle.update(stylesheet);
            } else {
                if (stylesheet) {
                    handle = runtime.addStylesheet(stylesheet);
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
