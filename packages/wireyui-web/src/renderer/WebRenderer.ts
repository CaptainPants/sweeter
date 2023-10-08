import type { JSXElement } from '@captainpants/wireyui-core';
import { mounted, unMounted } from '../internal/mounting.js';
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
        const mutationObserver = new MutationObserver((list, obs) => {
            for (const mutation of list) {
                if (mutation.addedNodes.length > 0) {
                    mounted(mutation.addedNodes);
                }
                if (mutation.removedNodes.length > 0) {
                    unMounted(mutation.removedNodes);
                }
            }
        });

        const content = render();

        mutationObserver.observe(element, { subtree: true, childList: true });

        addJsxChildren(element, content);

        return () => {
            mutationObserver.disconnect();
        };
    }
}
