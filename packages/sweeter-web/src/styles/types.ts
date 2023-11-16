import type { Signal } from '@captainpants/sweeter-core';
import type { GlobalCssClass } from './index.js';

export interface AbstractGlobalCssStylesheet {
    readonly symbol: symbol;
    readonly id: string;

    getContent(context: GlobalStyleSheetContentGeneratorContext): string;
}

export interface GlobalStyleSheetContentGeneratorContext {
    getClassName(cssClass: GlobalCssClass): string;
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
