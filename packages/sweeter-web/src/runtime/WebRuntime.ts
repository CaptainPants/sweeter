import { getRuntime, type Runtime } from '@captainpants/sweeter-core';
import type {
    AbstractGlobalCssStylesheet,
    GlobalStyleSheetContentGeneratorContext,
} from '../styles/index.js';
import { webRuntimeSymbol } from './internal/webRuntimeSymbol.js';

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

export function getWebRuntime(): WebRuntime {
    const runtime = getRuntime();
    if (runtime.type !== webRuntimeSymbol) {
        throw new TypeError('No WebRuntime set.');
    }
    return runtime as WebRuntime;
}
