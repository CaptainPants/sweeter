import type { Signal } from '@captainpants/sweeter-core';
import type { GlobalCssClass } from './index.js';

export interface AbstractGlobalCssStylesheet {
    readonly symbol: symbol;
    readonly id: string;

    getContent(
        context: GlobalStyleSheetContentGeneratorContext,
    ): string | undefined;

    getReferencedStylesheets(): readonly AbstractGlobalCssStylesheet[] | null;
}

export interface AbstractGlobalCssClass {
    readonly symbol: symbol;
    readonly className: string;
}

export interface GlobalStyleSheetContentGeneratorContext {
    getPrefixedClassName(cssClass: AbstractGlobalCssClass): string;
}

export type ElementCssClasses =
    | Signal<ElementCssClasses>
    | string
    | AbstractGlobalCssClass
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
