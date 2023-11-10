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
        const runtimeContext = new WebRuntimeContextImplementation(
            target,
            this,
        );

        return RuntimeContext.invokeWith(runtimeContext, () => {
            return WebRuntimeContext.invokeWith(runtimeContext, () => {
                return createNestedRoot(target, render);
            });
        });
    }
}

class WebRuntimeContextImplementation
    implements WebRuntimeContext, RuntimeContext
{
    #target: RuntimeRootHostElement;
    #runtime: WebRuntime;

    constructor(target: RuntimeRootHostElement, runtime: WebRuntime) {
        this.#target = target;
        this.#runtime = runtime;
    }

    addStylesheet(stylesheet: GlobalStylesheet): DocumentStylesheetHandle {
        const element = document.createElement('style');
        element.textContent = stylesheet.content;
        element.setAttribute('data-id', stylesheet.id);
        this.#target.ownerDocument.head.appendChild(element);

        return {
            remove() {
                element.remove();
            },
            update(stylesheet) {
                element.textContent = stylesheet.content;
            },
        };
    }

    getClassName(cssClass: GlobalCssClass): string {
        return cssClass.className;
    }

    createNestedRoot(
        target: RuntimeRootHostElement,
        render: () => JSX.Element,
    ) {
        return createNestedRoot(target, render);
    }

    renderOffscreen(content: JSX.Element): JSX.Element {
        return jsx('div', {
            style: { display: 'none' },
            children: content,
        });
    }
}

function createNestedRoot(
    target: RuntimeRootHostElement,
    render: () => JSX.Element,
) {
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
