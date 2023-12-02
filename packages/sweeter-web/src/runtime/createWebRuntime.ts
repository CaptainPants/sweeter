import {
    type PropsWithIntrinsicAttributesFor,
    type RuntimeRootHostElement,
    type Runtime,
    callWithRuntime,
    type ComponentOrIntrinsicElementTypeConstraint,
    type JSXResultForComponentOrElementType,
    trackingIsAnError,
    ErrorBoundaryContext,
    type JSXMiddleware,
    createMiddlewarePipeline,
    type JSXMiddlewareCallback,
} from '@captainpants/sweeter-core';
import { addJsxChildren } from './internal/addJsxChildren.js';
import { jsx } from './jsx.js';
import type { AbstractGlobalCssStylesheet } from '../styles/types.js';
import type { GlobalCssClass } from '../styles/GlobalCssClass.js';
import { createDOMElement } from './internal/createDOMElement.js';
import { createComponent } from './internal/createComponent.js';
import { webRuntimeSymbol } from './internal/webRuntimeSymbol.js';
import { type WebRuntime } from './types.js';

/**
 * Placeholder interface for future options to be provided to the root.
 */
export interface WebRuntimeOptions {
    root: RuntimeRootHostElement;
    render: () => JSX.Element;
    middleware?: JSXMiddleware[] | undefined;
    topLevelError?: (err: unknown) => void;
}

export function createWebRuntime(options: WebRuntimeOptions): WebRuntime {
    const runtime = new WebRuntimeImplementation(options);
    ErrorBoundaryContext.invokeWith(
        {
            error: err => {
                if (options.topLevelError){ 
                    options.topLevelError(err);
                    return;
                }
                
                console.error('Error reported with no ErrorBoundary', err);
            }
        },
        () => {
            runtime.createRoot(options.root, options.render);
        }
    )
    return runtime;
}

class WebRuntimeImplementation implements WebRuntime, Runtime {
    #target: RuntimeRootHostElement;

    #cssCounter: number = 0;
    #cssClassNameMap: WeakMap<GlobalCssClass, string> = new WeakMap();

    #disposeList: (() => void)[];

    #jsxWithMiddleware: JSXMiddlewareCallback;

    #includedSingletonStylesheetCounts: WeakMap<
        AbstractGlobalCssStylesheet,
        { count: number; element: HTMLStyleElement }
    >;

    constructor(options: WebRuntimeOptions) {
        this.#target = options.root;
        this.#disposeList = [];
        this.#jsxWithMiddleware = createMiddlewarePipeline(
            options.middleware ?? [],
            this.#endJsx.bind(this),
        );
        this.#includedSingletonStylesheetCounts = new WeakMap();
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

    getPrefixedClassName(cssClass: GlobalCssClass): string {
        let name = this.#cssClassNameMap.get(cssClass);
        if (!name) {
            name = '_glbl' + this.#cssCounter + '_' + cssClass.nameBasis;
            this.#cssClassNameMap.set(cssClass, name);
            ++this.#cssCounter;
        }
        return name;
    }

    addStylesheet(stylesheet: AbstractGlobalCssStylesheet): () => void {
        let entry = this.#includedSingletonStylesheetCounts.get(stylesheet);
        if (!entry) {
            const element = document.createElement('style');
            element.textContent = '\n' + stylesheet.getContent(this);
            element.setAttribute('data-id', stylesheet.id); // not a strictly unique id, just a way of identifying 'which' stylesheet it is
            this.#target.ownerDocument.head.appendChild(element);

            entry = {
                count: 1,
                element: element,
            };

            this.#includedSingletonStylesheetCounts.set(stylesheet, entry);
        }

        let removed = false;

        return () => {
            if (removed) {
                return;
            }

            this.removeStylesheet(stylesheet);

            removed = true; // don't do this again;
        };
    }

    removeStylesheet(stylesheet: AbstractGlobalCssStylesheet): void {
        const entry = this.#includedSingletonStylesheetCounts.get(stylesheet);
        if (!entry) {
            return;
        }

        --entry.count;
        if (entry.count === 0) {
            entry.element.remove();
            this.#includedSingletonStylesheetCounts.delete(stylesheet);
        }
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

    jsx<TComponentType extends ComponentOrIntrinsicElementTypeConstraint>(
        type: TComponentType,
        props: PropsWithIntrinsicAttributesFor<TComponentType>,
    ): JSXResultForComponentOrElementType<TComponentType> {
        return this.#jsxWithMiddleware(
            type,
            props,
        ) as JSXResultForComponentOrElementType<TComponentType>;
    }

    #endJsx<TComponentType extends ComponentOrIntrinsicElementTypeConstraint>(
        type: TComponentType,
        props: PropsWithIntrinsicAttributesFor<TComponentType>,
    ): JSXResultForComponentOrElementType<TComponentType> {
        // Its reasonably certain that people will trigger side effects when wiring up a component
        // and that these might update signals. We also don't want to accidentally subscribe to these
        // signals -- hence untrack the actual render
        const result = trackingIsAnError(() => {
            try {
                switch (typeof type) {
                    case 'function': {
                        // Component function
                        return createComponent(type, props, this);
                    }

                    case 'string': {
                        // intrinsic
                        const element = createDOMElement(
                            type,
                            props as PropsWithIntrinsicAttributesFor<
                                TComponentType & string
                            >,
                            this,
                        );

                        return element;
                    }

                    default:
                        throw new TypeError(`Unexpected type ${type}`);
                }
            } catch (ex) {
                ErrorBoundaryContext.getCurrent().error(ex);
                return 'Error processing...';
            }
        });

        return result as JSXResultForComponentOrElementType<TComponentType>;
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

    // Allow callers to be lazy and call the returned callback multiple times
    let unmounted = false;

    return () => {
        if (!unmounted) {
            unmounted = true;
            unmount();
        }
    };
}
