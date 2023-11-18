import { Context } from '@captainpants/sweeter-core';
import type {
    AbstractGlobalCssStylesheet,
    GlobalStyleSheetContentGeneratorContext,
} from '../styles/index.js';

export interface DocumentStylesheetHandle {
    remove(): void;
    update(stylesheet: AbstractGlobalCssStylesheet): void;
}

export interface WebRuntimeContext
    extends GlobalStyleSheetContentGeneratorContext {
    addStylesheet(
        stylesheet: AbstractGlobalCssStylesheet,
    ): DocumentStylesheetHandle;
}

export const WebRuntimeContext = new Context<WebRuntimeContext>('WebRuntime', {
    addStylesheet() {
        throw new TypeError('Not implemented');
    },
    getPrefixedClassName(cssClass) {
        throw new TypeError('Not implemented');
    },
});
