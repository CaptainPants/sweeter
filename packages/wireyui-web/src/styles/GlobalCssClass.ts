import type {
    GlobalStyleSheetContentGeneratorContext,
    AbstractGlobalCssStylesheet,
} from './types.js';

export class GlobalCssClass implements AbstractGlobalCssStylesheet {
    public readonly nameBasis: string;
    public readonly id: string;
    public readonly symbol: symbol;
    public readonly content: string;

    constructor(options: { nameBasis: string; content: string }) {
        this.nameBasis = options.nameBasis;
        this.id = options.nameBasis;
        this.symbol = Symbol('GlobalCssClass-' + options.nameBasis);
        this.content = options.content;
    }

    getContent(context: GlobalStyleSheetContentGeneratorContext): string {
        const name = context.getClassName(this);
        return `.${name}\r\n{\r\n${this.content}\r\n}`;
    }
}
