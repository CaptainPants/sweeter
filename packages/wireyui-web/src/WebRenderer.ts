import { JSXElement } from '@captainpants/wireyui-core';
import { appendJsxChildren } from '@captainpants/wireyui-web/jsx-runtime';

/**
 * Placeholder interface for future options to be provided to the root.
 */
export interface WebRendererOptions {}

export class WebRenderer {
    #options: WebRendererOptions;

    constructor(options?: WebRendererOptions) {
        this.#options = options ?? {};
    }

    start(element: HTMLElement, rootElements: JSXElement): void {
        appendJsxChildren(element, null, rootElements);
    }
}
