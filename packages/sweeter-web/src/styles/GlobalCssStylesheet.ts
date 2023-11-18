import { preprocess } from './preprocessor/preprocess.js';
import type {
    AbstractGlobalCssStylesheet,
    GlobalStyleSheetContentGeneratorContext,
} from './types.js';

export interface GlobalCssStylesheetOptions {
    id: string;
    content: string;
    preprocess?: boolean;
}

export class GlobalCssStylesheet implements AbstractGlobalCssStylesheet {
    public readonly content: string;
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

    getContent(context: GlobalStyleSheetContentGeneratorContext): string {
        const content = this.preprocess
            ? preprocess(this.content)
            : this.content;
        return content;
    }
}
