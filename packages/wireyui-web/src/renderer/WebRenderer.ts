import { PortalContext } from '@captainpants/wireyui-core';
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

    start(target: HTMLElement, render: () => JSX.Element): () => void {
        return PortalContext.invoke(
            {
                render: (target, render) => {
                    return this.#start(target, render);
                },
            },
            () => {
                return this.#start(target, render);
            },
        );
    }

    #start(
        target: JSX.PortalHostElement,
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

        return () => {
            unmount();
        };
    }
}
