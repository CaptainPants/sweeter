import type { GlobalStyleSheet } from './types.js';

export class GlobalCss implements GlobalStyleSheet {
    public content: string;
    public id: symbol;

    constructor(options: { content: string }) {
        this.content = options.content;
        this.id = Symbol('GlobalCss');
    }
}
