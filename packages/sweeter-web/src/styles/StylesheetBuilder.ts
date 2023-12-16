import {
    type StylesheetGenerator,
    type AbstractGlobalCssStylesheet,
} from './types.js';

export class StylesheetBuilder {
    #parts: (StylesheetGenerator | string)[] = [];
    #references: AbstractGlobalCssStylesheet[] = [];

    append(part: StylesheetGenerator | string): this {
        this.#parts.push(part);
        if (typeof part !== 'string') {
            this.#references.push(...part.references);
        }
        return this;
    }

    build(): StylesheetGenerator {
        const res: StylesheetGenerator = (context) => {
            return this.#parts
                .map((x) => (typeof x === 'string' ? x : x(context)))
                .join('\n');
        };

        res.references = this.#references.slice();

        return res;
    }
}
