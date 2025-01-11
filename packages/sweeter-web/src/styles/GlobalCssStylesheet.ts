import { preprocess } from './preprocessor/preprocess.js';
import { type StylesheetDependencyProvider } from './StylesheetDependencyProvider.js';
import {
    type AbstractGlobalCssStylesheet,
    type GlobalStyleSheetContentGeneratorContext,
    type StylesheetContentGenerator,
} from './types.js';

export type GlobalCssStylesheetContent = string | StylesheetContentGenerator;

export interface GlobalCssStylesheetOptions {
    id: string;
    content: GlobalCssStylesheetContent;
    preprocess?: boolean;
    extraDependencies?: StylesheetDependencyProvider;
}

export class GlobalCssStylesheet implements AbstractGlobalCssStylesheet {
    public readonly content: GlobalCssStylesheetContent;
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
                : this.content?.generate(context);

        const transformed = this.preprocess ? preprocess(content) : content;

        return transformed;
    }

    getReferencedStylesheets():
        | readonly AbstractGlobalCssStylesheet[]
        | undefined {
        let result =
            typeof this.content === 'string'
                ? undefined
                : this.content.getReferencedStylesheets();

        if (this.#extraDependencies) {
            result ??= [];
            result.push(...this.#extraDependencies);
        }

        return result;
    }
}
