import { preprocessClassContent } from './preprocessor/preprocess.js';
import type {
    GlobalStyleSheetContentGeneratorContext,
    AbstractGlobalCssStylesheet,
} from './types.js';

export interface GlobalCssClassOptions {
    className: string;
    content: string;
    preprocess?: boolean;
}

export class GlobalCssClass implements AbstractGlobalCssStylesheet {
    public readonly nameBasis: string;
    public readonly id: string;
    public readonly symbol: symbol;
    public readonly content: string;
    public readonly preprocess: boolean;

    constructor(options: GlobalCssClassOptions);
    constructor({
        className,
        content,
        preprocess = true,
    }: GlobalCssClassOptions) {
        this.nameBasis = className;
        this.id = className;
        this.symbol = Symbol('GlobalCssClass-' + className);
        this.content = content;
        this.preprocess = preprocess;
    }

    getContent(context: GlobalStyleSheetContentGeneratorContext): string {
        const name = context.getPrefixedClassName(this);
        const content = this.preprocess
            ? preprocessClassContent(name, this.content)
            : `.${name}\r\n{\r\n${this.content}\r\n}`;
        return content;
    }
}
