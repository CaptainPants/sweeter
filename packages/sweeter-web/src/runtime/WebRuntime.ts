import { RuntimeContext } from '@captainpants/sweeter-core';
import type {
    Component,
    PropsWithIntrinsicAttributesFor,
    RuntimeRootHostElement,
} from '@captainpants/sweeter-core';
import { addJsxChildren } from './internal/addJsxChildren.js';
import { announceChildrenMountedRecursive } from './internal/mounting.js';
import { jsx } from './jsx.js';
import type { DocumentStylesheetHandle } from './WebRuntimeContext.js';
import { WebRuntimeContext } from './WebRuntimeContext.js';
import type { AbstractGlobalCssStylesheet } from '../styles/types.js';
import type { GlobalCssClass } from '../styles/GlobalCssClass.js';
import { renderDOMElement } from './internal/renderDOMElement.js';
import { renderComponent } from './internal/renderComponent.js';

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

    #cssCounter: number = 0;
    #cssClassNameMap: WeakMap<GlobalCssClass, string> = new WeakMap();

    constructor(target: RuntimeRootHostElement, runtime: WebRuntime) {
        this.#target = target;
        this.#runtime = runtime;
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
        return createNestedRoot(target, render);
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
        return renderDOMElement(type, props, this);
    }

    createComponent<TComponentType extends Component<unknown>>(
        Component: TComponentType,
        props: PropsWithIntrinsicAttributesFor<TComponentType>,
    ): JSX.Element {
        return renderComponent(Component, props, this);
    }
}

function createNestedRoot(
    target: RuntimeRootHostElement,
    render: () => JSX.Element,
) {
    const content = render();

    const unmount = addJsxChildren(target, content);

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
