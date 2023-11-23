import type { Signal } from '@captainpants/sweeter-core';
import type { GlobalCssClass, GlobalCssStylesheet } from './index.js';

export interface AbstractGlobalCssStylesheet {
    readonly symbol: symbol;
    readonly id: string;

    getContent(context: GlobalStyleSheetContentGeneratorContext): string;
}

export interface GlobalStyleSheetContentGeneratorContext {
    getPrefixedClassName(cssClass: GlobalCssClass): string;

    ensureCssClassAdded(cssClass: GlobalCssClass): void;

    addStylesheet(stylesheet: GlobalCssStylesheet): () => void;
}

export type ElementCssClasses =
    | Signal<ElementCssClasses>
    | string
    | GlobalCssClass
    | undefined
    | null
    | (
          | string
          | GlobalCssClass
          | undefined
          | null
          | Signal<ElementCssClasses>
      )[];
