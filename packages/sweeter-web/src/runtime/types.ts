import type { Runtime } from '@captainpants/sweeter-core';
import type {
    AbstractGlobalCssStylesheet,
    GlobalStyleSheetContentGeneratorContext,
} from '../index.js';

export interface WebRuntime
    extends Runtime,
        GlobalStyleSheetContentGeneratorContext {
    addStylesheet(stylesheet: AbstractGlobalCssStylesheet): () => void;

    removeStylesheet(stylesheet: AbstractGlobalCssStylesheet): void;

    nextId(basis?: string): string;
}
