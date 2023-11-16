import { preprocessClassContent } from './preprocessor/preprocess.js';
import type {
    GlobalStyleSheetContentGeneratorContext,
    AbstractGlobalCssStylesheet,
} from './types.js';

export interface GlobalCssClassOptions {
    nameBasis: string;
    content: string;
    preprocess?: boolean;
}

export class GlobalCssClass implements AbstractGlobalCssStylesheet {
    public readonly nameBasis: string;
    public readonly id: string;
    public readonly symbol: symbol;
    public readonly content: string;
    public readonly preprocess: boolean;

    constructor({
        nameBasis,
        content,
        preprocess = true,
    }: GlobalCssClassOptions) {
        this.nameBasis = nameBasis;
        this.id = nameBasis;
        this.symbol = Symbol('GlobalCssClass-' + nameBasis);
        this.content = content;
        this.preprocess = preprocess;
    }

    getContent(context: GlobalStyleSheetContentGeneratorContext): string {
        const name = context.getClassName(this);
        const content = this.preprocess
            ? preprocessClassContent(name, this.content)
            : `.${name}\r\n{\r\n${this.content}\r\n}`;
        return content;
    }
}
