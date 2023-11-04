import type { GlobalStyleSheet } from './types.js';

let counter = 0;

export class GlobalCssClass implements GlobalStyleSheet {
    public readonly className: string;
    public readonly content: string;
    public readonly id: symbol;

    constructor(options: { id: string; content: string }) {
        this.className = '_glbl' + counter + '_' + options.id;
        ++counter;

        this.content = `.${this.className} {\r\n${options.content}\r\n}`;
        this.id = Symbol('GlobalCssClass');
    }
}
