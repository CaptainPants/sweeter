import { Context } from '@captainpants/wireyui-core';
import type { GlobalStylesheet } from '../styles/index.js';

export interface DocumentStylesheetHandle {
    remove(): void;
    update(stylesheet: GlobalStylesheet): void;
}

export interface WebRuntimeContext {
    addStylesheet(stylesheet: GlobalStylesheet): DocumentStylesheetHandle;
}

export const WebRuntimeContext = new Context<WebRuntimeContext>('WebRuntime', {
    addStylesheet() {
        throw new TypeError('Not implemented');
    },
});
