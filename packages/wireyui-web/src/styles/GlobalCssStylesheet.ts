import type {
    AbstractGlobalCssStylesheet,
    GlobalStyleSheetContentGeneratorContext,
} from './types.js';

export class GlobalCssStylesheet implements AbstractGlobalCssStylesheet {
    public readonly content: string;
    public readonly id: string;
    public readonly symbol: symbol;

    constructor(options: { id: string; content: string }) {
        this.id = options.id;
        this.symbol = Symbol('GlobalCssStylesheet-' + options.id);
        this.content = options.content;
    }

    getContent(context: GlobalStyleSheetContentGeneratorContext): string {
        return this.content;
    }
}
