import type { Signal } from '@captainpants/sweeter-core';

export interface AbstractGlobalCssStylesheet {
    readonly symbol: symbol;
    readonly id: string;

    getContent(
        context: GlobalStyleSheetContentGeneratorContext,
    ): string | undefined;

    getReferencedStylesheets():
        | readonly AbstractGlobalCssStylesheet[]
        | undefined;
}

export interface AbstractGlobalCssClass extends AbstractGlobalCssStylesheet {
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
    references: readonly AbstractGlobalCssStylesheet[];
};
