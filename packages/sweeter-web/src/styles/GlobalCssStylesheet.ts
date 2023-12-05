import { type GlobalCssClass } from './GlobalCssClass.js';
import { preprocess } from './preprocessor/preprocess.js';
import type {
    AbstractGlobalCssStylesheet,
    GlobalStyleSheetContentGeneratorContext,
    StylesheetGenerator,
} from './types.js';

type Content = string | StylesheetGenerator;

export interface GlobalCssStylesheetOptions {
    id: string;
    content: Content;
    preprocess?: boolean;
}

export type Builder = (
    template: TemplateStringsArray,
    ...params: GlobalCssClass[]
) => string;

export class GlobalCssStylesheet implements AbstractGlobalCssStylesheet {
    public readonly content: Content;
    public readonly id: string;
    public readonly symbol: symbol;
    public readonly preprocess: boolean;

    constructor(options: GlobalCssStylesheetOptions);
    constructor({
        id,
        content,
        preprocess = true,
    }: GlobalCssStylesheetOptions) {
        this.id = id;
        this.symbol = Symbol('GlobalCssStylesheet-' + id);
        this.content = content;
        this.preprocess = preprocess;
    }

    getContent(
        context: GlobalStyleSheetContentGeneratorContext,
    ): string | undefined {
        const content =
            typeof this.content === 'string'
                ? this.content
                : this.content(context);

        const transformed = this.preprocess ? preprocess(content) : content;

        return transformed;
    }
}
