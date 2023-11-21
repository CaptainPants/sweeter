import type { Runtime } from '@captainpants/sweeter-core';
import type {
    AbstractGlobalCssStylesheet,
    GlobalStyleSheetContentGeneratorContext,
} from '../index.js';

export interface DocumentStylesheetHandle {
    remove(): void;
    update(stylesheet: AbstractGlobalCssStylesheet): void;
}

export interface WebRuntime
    extends Runtime,
        GlobalStyleSheetContentGeneratorContext {
    addStylesheet(
        stylesheet: AbstractGlobalCssStylesheet,
    ): DocumentStylesheetHandle;
}
