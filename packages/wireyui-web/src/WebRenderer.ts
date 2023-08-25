import { JSXElement } from '@captainpants/wireyui-core';

/**
 * Placeholder interface for future options to be provided to the root.
 */
export interface WebRendererOptions {}

export class WebRenderer {
    #options: WebRendererOptions;

    constructor(options?: WebRendererOptions) {
        this.#options = options ?? {};
    }

    start(element: HTMLElement, rootComponent: JSXElement): void {
        throw 'Something';
    }
}
