import type { StylesheetDependencyProvider } from './StylesheetDependencyProvider.js';
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
    extraDependencies?: StylesheetDependencyProvider;
}

export class GlobalCssStylesheet implements AbstractGlobalCssStylesheet {
    public readonly content: Content;
    public readonly id: string;
    public readonly symbol: symbol;
    public readonly preprocess: boolean;

    #extraDependencies?: AbstractGlobalCssStylesheet[];

    constructor(options: GlobalCssStylesheetOptions);
    constructor({
        id,
        content,
        preprocess = true,
        extraDependencies,
    }: GlobalCssStylesheetOptions) {
        this.id = id;
        this.symbol = Symbol('GlobalCssStylesheet-' + id);
        this.content = content;
        this.preprocess = preprocess;

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
        const content =
            typeof this.content === 'string'
                ? this.content
                : this.content(context);

        const transformed = this.preprocess ? preprocess(content) : content;

        return transformed;
    }

    getReferencedStylesheets():
        | readonly AbstractGlobalCssStylesheet[]
        | undefined {
        let result: AbstractGlobalCssStylesheet[] | undefined =
            typeof this.content === 'function'
                ? [...this.content.references]
                : undefined;

        if (this.#extraDependencies) {
            result ??= [];
            result.push(...this.#extraDependencies);
        }
        return result;
    }
}
