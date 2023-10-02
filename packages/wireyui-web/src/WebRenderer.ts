import type { JSXElement } from '@captainpants/wireyui-core';
import { appendJsxChildren } from '@captainpants/wireyui-web/jsx-runtime';
import { mounted, unmounted } from './internal/mounting.js';

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
        const mutationObserver = new MutationObserver((list, obs) => {
            for (const mutation of list) {
                if (mutation.addedNodes.length > 0) {
                    mounted(mutation.addedNodes);
                }
                if (mutation.removedNodes.length > 0) {
                    unmounted(mutation.removedNodes);
                }
            }
        });

        const content = render();

        mutationObserver.observe(element, { subtree: true, childList: true });

        appendJsxChildren(element, null, content);

        return () => {
            mutationObserver.disconnect();
        };
    }
}
