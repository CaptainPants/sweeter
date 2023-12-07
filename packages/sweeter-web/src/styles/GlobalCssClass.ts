import { preprocessClassContent } from './preprocessor/preprocess.js';
import type {
    GlobalStyleSheetContentGeneratorContext,
    AbstractGlobalCssStylesheet,
    StylesheetGenerator,
} from './types.js';

type Content =
    | ((self: GlobalCssClass) => string | StylesheetGenerator)
    | string
    | undefined;

type ContentConstructed = StylesheetGenerator | string | undefined;

export interface GlobalCssClassOptions {
    /**
     * Base the class name for this class on this value (it will be prefixed/suffixed or otherwise made unique).
     */
    className: string;
    content?: Content;
    preprocess?: boolean;
}

export class GlobalCssClass implements AbstractGlobalCssStylesheet {
    public readonly className: string;
    public readonly id: string;
    public readonly symbol: symbol;
    public readonly content?: ContentConstructed;
    public readonly preprocess: boolean;

    constructor(options: GlobalCssClassOptions);
    constructor({
        className,
        content,
        preprocess = true,
    }: GlobalCssClassOptions) {
        this.className = className;
        this.id = className;
        this.symbol = Symbol('GlobalCssClass-' + className);
        this.preprocess = preprocess;

        this.content = typeof content === 'function' ? content(this) : content;
    }

    getContent(
        context: GlobalStyleSheetContentGeneratorContext,
    ): string | undefined {
        const name = context.getPrefixedClassName(this);

        const content =
            typeof this.content === 'string'
                ? this.content
                : this.content?.(context);

        if (!content) {
            return undefined;
        }

        const transformed = this.preprocess
            ? preprocessClassContent(name, content)
            : `.${name}\r\n{\r\n${content}\r\n}`;
        return transformed;
    }

    getReferencedStylesheets(): readonly AbstractGlobalCssStylesheet[] | null {
        return typeof this.content === 'function'
            ? this.content.referencedClasses
            : null;
    }
}
