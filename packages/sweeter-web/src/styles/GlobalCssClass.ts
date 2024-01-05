import { type StylesheetDependencyProvider } from './StylesheetDependencyProvider.js';
import { preprocessClassContent } from './preprocessor/preprocess.js';
import {
    type GlobalStyleSheetContentGeneratorContext,
    type AbstractGlobalCssStylesheet,
    type StylesheetContentGenerator,
    type AbstractGlobalCssClass,
} from './types.js';

export type GlobalCssClassContent =
    | ((self: GlobalCssClass) => string | StylesheetContentGenerator)
    | string;

export type GlobalCssClassContentConstructed =
    | StylesheetContentGenerator
    | string;

export interface GlobalCssClassOptions {
    /**
     * Base the class name for this class on this value (it will be prefixed/suffixed or otherwise made unique).
     */
    className: string;
    content?: GlobalCssClassContent | undefined;
    preprocess?: boolean;
    extraDependencies?: StylesheetDependencyProvider;
}

export class GlobalCssClass
    implements AbstractGlobalCssStylesheet, AbstractGlobalCssClass
{
    public readonly className: string;
    public readonly id: string;
    public readonly symbol: symbol;
    public readonly classContent?: GlobalCssClassContentConstructed | undefined;
    public readonly preprocess: boolean;

    #extraDependencies?: AbstractGlobalCssStylesheet[];

    constructor(options: GlobalCssClassOptions);
    constructor({
        className,
        content,
        preprocess = true,
        extraDependencies,
    }: GlobalCssClassOptions) {
        this.className = className;
        this.id = className;
        this.symbol = Symbol('GlobalCssClass-' + className);
        this.preprocess = preprocess;

        this.classContent =
            typeof content === 'function' ? content(this) : content;

        if (extraDependencies) {
            extraDependencies.addDependencyListener((dependency) => {
                this.#extraDependencies ??= [];
                this.#extraDependencies.push(dependency);
            });
        }
    }

    getContent(
        context: GlobalStyleSheetContentGeneratorContext,
    ): string | undefined {
        const name = context.getPrefixedClassName(this);

        const content =
            typeof this.classContent === 'string'
                ? this.classContent
                : this.classContent?.(context);

        if (!content) {
            return undefined;
        }

        const transformed = this.preprocess
            ? preprocessClassContent(name, content)
            : `.${name}\r\n{\r\n${content}\r\n}`;
        return transformed;
    }

    getReferencedStylesheets():
        | readonly AbstractGlobalCssStylesheet[]
        | undefined {
        let result =
            typeof this.classContent === 'function'
                ? this.classContent.getReferencedStylesheets()
                : undefined;

        if (this.#extraDependencies) {
            result ??= [];
            result.push(...this.#extraDependencies);
        }

        return result;
    }
}
