import type { StylesheetDependencyProvider } from './StylesheetDependencyProvider.js';
import type {
    AbstractGlobalCssClass,
    AbstractGlobalCssStylesheet,
    GlobalStyleSheetContentGeneratorContext,
} from './types.js';

export interface GlobalCssMarkerClassOptions {
    /**
     * Base the class name for this class on this value (it will be prefixed/suffixed or otherwise made unique).
     */
    className: string;
    dependencies?: StylesheetDependencyProvider;
}

/**
 * A classname that doesn't have a definition, for use in the definition of other classes. This could be e.g. 'primary' or 'outline'.
 */
export class GlobalCssMarkerClass implements AbstractGlobalCssClass {
    public readonly className: string;
    public readonly id: string;
    public readonly symbol: symbol;

    #dependencies?: AbstractGlobalCssStylesheet[];

    constructor(options: GlobalCssMarkerClassOptions);
    constructor({ className, dependencies }: GlobalCssMarkerClassOptions) {
        this.className = className;
        this.id = className;
        this.symbol = Symbol('GlobalCssClass-' + className);

        if (dependencies) {
            dependencies.addDependencyListener((dependency) => {
                this.#dependencies ??= [];
                this.#dependencies.push(dependency);
            });
        }
    }

    getContent(
        context: GlobalStyleSheetContentGeneratorContext,
    ): string | undefined {
        return undefined;
    }

    getReferencedStylesheets():
        | readonly AbstractGlobalCssStylesheet[]
        | undefined {
        return this.#dependencies;
    }
}
