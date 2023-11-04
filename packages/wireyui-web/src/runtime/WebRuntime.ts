import {
    Context,
    RuntimeContext,
    type RuntimeRootHostElement,
} from '@captainpants/wireyui-core';
import { addJsxChildren } from './internal/addJsxChildren.js';
import { mounted } from './internal/mounting.js';

export interface WebRuntimeContextType {}

export const WebRuntimeContext = new Context<WebRuntimeContextType>(
    'WebRuntime',
    {},
);

/**
 * Placeholder interface for future options to be provided to the root.
 */
export interface WebRuntimeOptions {}

export class WebRuntime {
    #options: WebRuntimeOptions;

    constructor(options?: WebRuntimeOptions) {
        this.#options = options ?? {};
    }

    createRoot(
        target: RuntimeRootHostElement,
        render: () => JSX.Element,
    ): () => void {
        return RuntimeContext.invokeWith(
            {
                start: (target, render) => {
                    return this.#createRoot(target, render);
                },
            },
            () => {
                return WebRuntimeContext.invokeWith({}, () => {
                    return this.#createRoot(target, render);
                });
            },
        );
    }

    #createRoot(
        target: RuntimeRootHostElement,
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
