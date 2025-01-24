import { type Runtime, type Signal } from '@serpentis/ptolemy-core';

import {
    type AbstractGlobalCssStylesheet,
    type GlobalStyleSheetContentGeneratorContext,
} from '../index.js';

export interface WebRuntime
    extends Runtime,
        GlobalStyleSheetContentGeneratorContext {
    addStylesheet(stylesheet: AbstractGlobalCssStylesheet): () => void;

    removeStylesheet(stylesheet: AbstractGlobalCssStylesheet): void;

    nextId(basis?: string): string;

    readonly location: Signal<string>;

    navigate(url: string): void;

    createElement(tagName: string): HTMLElement | SVGElement;

    createComment(content?: string): Comment;
}
