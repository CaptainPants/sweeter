import type { Signal } from '@captainpants/sweeter-core';
import type { GlobalCssClass } from './index.js';

export interface AbstractGlobalCssStylesheet {
    readonly symbol: symbol;
    readonly id: string;

    getContent(
        context: GlobalStyleSheetContentGeneratorContext,
    ): string | undefined;

    getReferencedClasses(): readonly GlobalCssClass[] | null;
}

export interface GlobalStyleSheetContentGeneratorContext {
    getPrefixedClassName(cssClass: GlobalCssClass): string;
}

export type ElementCssClasses =
    | Signal<ElementCssClasses>
    | string
    | GlobalCssClass
    | Record<string, Signal<boolean> | boolean>
    | undefined
    | null
    | ElementCssClasses[];

export type StylesheetInclude =
    | AbstractGlobalCssStylesheet
    | AbstractGlobalCssStylesheet[];

export type StylesheetGenerator = {
    (context: GlobalStyleSheetContentGeneratorContext): string;
    referencedClasses: readonly GlobalCssClass[];
};
