import {
    Context,
    RuntimeContext,
    type RuntimeRootHostElement,
} from '@captainpants/wireyui-core';
import { addJsxChildren } from './internal/addJsxChildren.js';
import {
    announceMountedRecursive,
} from './internal/mounting.js';
import type { GlobalStyleSheet } from '../styles/types.js';
import { jsx } from './jsx.js';

export interface WebRuntimeContextType {
    addStyleSheet(stylesheet: GlobalStyleSheet): () => void;
}

export const WebRuntimeContext = new Context<WebRuntimeContextType>(
    'WebRuntime',
    {
        addStyleSheet() {
            throw new TypeError('Not implemented');
        },
    },
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
                    return this.#createRootImplementation(target, render);
                },
                renderOffscreen: (content) => {
                    return jsx('div', {
                        style: { display: 'none' },
                        children: content,
                    });
                },
            },
            () => {
                return WebRuntimeContext.invokeWith(
                    {
                        addStyleSheet() {
                            throw new TypeError('Not implemented');
                        },
                    },
                    () => {
                        return this.#createRootImplementation(target, render);
                    },
                );
            },
        );
    }

    #createRootImplementation(
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
            announceMountedRecursive(current);
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
