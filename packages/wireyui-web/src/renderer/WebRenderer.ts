import { RendererContext } from '@captainpants/wireyui-core';
import { addJsxChildren } from '../runtime/internal/addJsxChildren.js';
import { mounted } from '../runtime/internal/mounting.js';

/**
 * Placeholder interface for future options to be provided to the root.
 */
export interface WebRendererOptions {}

export class WebRenderer {
    #options: WebRendererOptions;

    constructor(options?: WebRendererOptions) {
        this.#options = options ?? {};
    }

    start(
        target: JSX.RendererHostElement,
        render: () => JSX.Element,
    ): () => void {
        const cleanup = RendererContext.replace({
            start: (target, render) => {
                return this.#start(target, render);
            },
        });
        try {
            return this.#start(target, render);
        } finally {
            cleanup();
        }
    }

    #start(
        target: JSX.RendererHostElement,
        render: () => JSX.Element,
    ): () => void {
        const content = render();

        const unmount = addJsxChildren(target, content);

        for (
            let current = target.lastChild;
            current;
            current = current.previousSibling
        ) {
            mounted(current);
        }

        // Allow callers to be lazy and call the returned callback multiple times
        let unmounted = false;

        return () => {
            if (!unmounted) {
                unmounted = true;
                unmount();
            }
        };
    }
}
