import type { GlobalStylesheet } from './types.js';

export class GlobalCss implements GlobalStylesheet {
    public readonly content: string;
    public readonly id: string;
    public readonly symbol: symbol;

    constructor(options: { id: string; content: string }) {
        this.content = options.content;
        this.id = options.id;
        this.symbol = Symbol('GlobalCss-' + options.id);
    }
}
