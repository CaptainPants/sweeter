import {
    RuntimeContext,
    type RuntimeRootHostElement,
} from '@captainpants/wireyui-core';
import { addJsxChildren } from './internal/addJsxChildren.js';
import { announceMountedRecursive } from './internal/mounting.js';
import { jsx } from './jsx.js';
import type { DocumentStylesheetHandle } from './WebRuntimeContext.js';
import { WebRuntimeContext } from './WebRuntimeContext.js';
import type { GlobalStylesheet } from '../styles/types.js';
import type { GlobalCssClass } from '../styles/GlobalCssClass.js';

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
        const runtimeContext = this.#createWebRuntimeContext(target, this);

        return RuntimeContext.invokeWith(runtimeContext, () => {
            return WebRuntimeContext.invokeWith(runtimeContext, () => {
                return this.#createRootImplementation(target, render);
            });
        });
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

    #createWebRuntimeContext(
        target: RuntimeRootHostElement,
        runtime: WebRuntime,
    ): WebRuntimeContext & RuntimeContext {
        return {
            addStylesheet(
                stylesheet: GlobalStylesheet,
            ): DocumentStylesheetHandle {
                const element = document.createElement('style');
                element.textContent = stylesheet.content;
                element.setAttribute('data-id', stylesheet.id);
                target.ownerDocument.head.appendChild(element);

                return {
                    remove() {
                        element.remove();
                    },
                    update(stylesheet) {
                        element.textContent = stylesheet.content;
                    },
                };
            },
            getClassName(cssClass: GlobalCssClass): string {
                return cssClass.className;
            },
            start: (target, render) => {
                return runtime.#createRootImplementation(target, render);
            },
            renderOffscreen: (content) => {
                return jsx('div', {
                    style: { display: 'none' },
                    children: content,
                });
            },
        };
    }
}
