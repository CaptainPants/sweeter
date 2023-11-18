import {
    type Component,
    type PropsWithIntrinsicAttributesFor,
    type RuntimeRootHostElement,
    type Runtime,
    callWithRuntime,
} from '@captainpants/sweeter-core';
import { addJsxChildren } from './internal/addJsxChildren.js';
import { announceChildrenMountedRecursive } from './internal/mounting.js';
import { jsx } from './jsx.js';
import type { DocumentStylesheetHandle, WebRuntime } from './WebRuntime.js';
import type { AbstractGlobalCssStylesheet } from '../styles/types.js';
import type { GlobalCssClass } from '../styles/GlobalCssClass.js';
import { createDOMElement } from './internal/createDOMElement.js';
import { createComponent } from './internal/createComponent.js';
import { webRuntimeSymbol } from './internal/webRuntimeSymbol.js';

/**
 * Placeholder interface for future options to be provided to the root.
 */
export interface WebRuntimeOptions {
    root: RuntimeRootHostElement;
    render: () => JSX.Element;
}

export function createWebRuntime(options: WebRuntimeOptions): WebRuntime;
export function createWebRuntime({
    root,
    render,
}: WebRuntimeOptions): WebRuntime {
    const runtime = new WebRuntimeImplementation(root);
    runtime.createRoot(root, render);
    return runtime;
}

class WebRuntimeImplementation implements WebRuntime, Runtime {
    #target: RuntimeRootHostElement;

    #cssCounter: number = 0;
    #cssClassNameMap: WeakMap<GlobalCssClass, string> = new WeakMap();

    #disposeList: (() => void)[];

    constructor(target: RuntimeRootHostElement) {
        this.#target = target;
        this.#disposeList = [];
    }

    createRoot(
        target: RuntimeRootHostElement,
        render: () => JSX.Element,
    ): void {
        callWithRuntime(this, () => {
            const dispose = createNestedRoot(target, render, this);
            this.#disposeList.push(dispose);
        });
    }

    dispose(): void {
        while (this.#disposeList.length > 0) {
            this.#disposeList.pop()?.();
        }
    }

    addStylesheet(
        stylesheet: AbstractGlobalCssStylesheet,
    ): DocumentStylesheetHandle {
        const element = document.createElement('style');
        element.textContent = '\n' + stylesheet.getContent(this);
        element.setAttribute('data-id', stylesheet.id); // not a strictly unique id, just a way of identifying 'which' stylesheet it is
        this.#target.ownerDocument.head.appendChild(element);

        return {
            remove() {
                element.remove();
            },
            update: (stylesheet) => {
                element.textContent = '\n' + stylesheet.getContent(this);
            },
        };
    }

    getPrefixedClassName(cssClass: GlobalCssClass): string {
        let name = this.#cssClassNameMap.get(cssClass);
        if (!name) {
            name = '_glbl' + this.#cssCounter + '_' + cssClass.nameBasis;
            this.#cssClassNameMap.set(cssClass, name);
            ++this.#cssCounter;
        }
        return name;
    }

    createNestedRoot(
        target: RuntimeRootHostElement,
        render: () => JSX.Element,
    ) {
        return createNestedRoot(target, render, this);
    }

    renderOffscreen(content: JSX.Element): JSX.Element {
        return jsx('div', {
            style: { display: 'none' },
            children: content,
        });
    }

    createDOMElement<TElementTypeString extends string>(
        type: TElementTypeString,
        props: PropsWithIntrinsicAttributesFor<TElementTypeString>,
    ): HTMLElement | SVGElement {
        return createDOMElement(type, props, this);
    }

    createComponent<TComponentType extends Component<unknown>>(
        Component: TComponentType,
        props: PropsWithIntrinsicAttributesFor<TComponentType>,
    ): JSX.Element {
        return createComponent(Component, props, this);
    }

    get type(): symbol {
        return webRuntimeSymbol;
    }
}

function createNestedRoot(
    target: RuntimeRootHostElement,
    render: () => JSX.Element,
    webRuntime: WebRuntime,
) {
    const content = render();

    const unmount = addJsxChildren(target, content, webRuntime);

    announceChildrenMountedRecursive(target);

    // Allow callers to be lazy and call the returned callback multiple times
    let unmounted = false;

    return () => {
        if (!unmounted) {
            unmounted = true;
            unmount();
        }
    };
}
