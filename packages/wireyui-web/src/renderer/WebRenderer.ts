import type { JSXElement } from '@captainpants/wireyui-core';
import { addJsxChildren } from '../runtime/internal/addJsxChildren.js';

/**
 * Placeholder interface for future options to be provided to the root.
 */
export interface WebRendererOptions {}

export class WebRenderer {
    #options: WebRendererOptions;

    constructor(options?: WebRendererOptions) {
        this.#options = options ?? {};
    }

    start(element: HTMLElement, render: () => JSXElement): () => void {
        const content = render();

        addJsxChildren(element, content);

        return () => {};
    }
}
