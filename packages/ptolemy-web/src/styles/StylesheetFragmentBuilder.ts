import {
    type AbstractGlobalCssStylesheet,
    type StylesheetContentGenerator,
} from './types.js';

export interface StylesheetFragmentBuilderState {
    parts: (StylesheetContentGenerator | string)[];
    references: AbstractGlobalCssStylesheet[] | undefined;
}

export class StylesheetFragmentBuilder {
    #built = false;
    #parts: (StylesheetContentGenerator | string)[] = [];
    #references: AbstractGlobalCssStylesheet[] | undefined = undefined;

    append(part: StylesheetContentGenerator | string): this {
        if (this.#built) {
            throw new TypeError(
                'Builder already built, so cannot be modified.',
            );
        }

        this.#parts.push(part);
        if (typeof part !== 'string') {
            const refs = part.getReferencedStylesheets();
            if (refs) {
                this.#references ??= [];
                this.#references.push(...refs);
            }
        }
        return this;
    }

    appendLine(part: StylesheetContentGenerator | string): this {
        this.append(part);
        this.#parts.push('\n');
        return this;
    }

    /**
     * Create a StylesheetContentGenerator from this builder, and freezes the builder.
     * @returns
     */
    build(): StylesheetContentGenerator {
        const res: StylesheetContentGenerator = {
            generate: (context) => {
                return this.#parts
                    .map((x) =>
                        typeof x === 'string' ? x : x.generate(context),
                    )
                    .join('');
            },
            getReferencedStylesheets: () => this.#references?.slice(),
        };

        this.#built = true;

        return res;
    }

    /**
     * Mostly for debugging.
     * @returns
     */
    getState(): StylesheetFragmentBuilderState {
        return {
            parts: this.#parts.slice(),
            references: this.#references?.slice(),
        };
    }

    get built(): boolean {
        return this.#built;
    }
}
