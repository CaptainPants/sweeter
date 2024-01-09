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

export type StylesheetInclude =
    | AbstractGlobalCssStylesheet
    | AbstractGlobalCssStylesheet[];

export type StylesheetContentGenerator = {
    generate(context: GlobalStyleSheetContentGeneratorContext): string;

    getReferencedStylesheets(): AbstractGlobalCssStylesheet[] | undefined;
};
