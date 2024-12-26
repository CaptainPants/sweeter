import {
    type PropsWithIntrinsicAttributesFor,
    type RuntimeRootHostElement,
    type Runtime,
    callWithRuntime,
    type ComponentOrIntrinsicElementTypeConstraint,
    type JSXResultForComponentOrElementType,
    trackingIsAnError,
    type JSXMiddleware,
    createMiddlewarePipeline,
    type JSXMiddlewareCallback,
    type Signal,
    Context,
    ComponentFaultContext,
    $insertLocation,
} from '@captainpants/sweeter-core';
import { addJsxChildren } from './internal/addJsxChildren.js';
import { jsx } from './jsx.js';
import { type AbstractGlobalCssStylesheet } from '../styles/types.js';
import { type GlobalCssClass } from '../styles/GlobalCssClass.js';
import { createDOMElement } from './internal/createDOMElement.js';
import { createComponentInstance } from './internal/createComponentInstance.js';
import { webRuntimeSymbol } from './internal/webRuntimeSymbol.js';
import { type WebRuntime } from './types.js';
import { createLocationSignal } from './internal/createLocationSignal.js';
import { StylesheetManager } from '../styles/internal/StylesheetManager.js';
import {
    announceMountedRecursive,
    announceUnMountedRecursive,
} from './internal/mounting.js';
import { createLogger } from '@captainpants/sweeter-utilities';

/**
 * Placeholder interface for future options to be provided to the root.
 */
export interface WebRuntimeOptions {
    root: RuntimeRootHostElement;
    render: () => JSX.Element;
    middleware?: JSXMiddleware[] | undefined;
    topLevelError?: (err: unknown) => void;

    classNameFormat?:
        | ((counter: number, className: string) => string)
        | undefined;
}

export function createWebRuntime(options: WebRuntimeOptions): WebRuntime {
    const runtime = new WebRuntimeImplementation(options);
    runtime.createRoot(options.root, options.render);
    return runtime;
}

class WebRuntimeImplementation implements WebRuntime, Runtime {
    #target: RuntimeRootHostElement;

    #disposeList: (() => void)[];

    #jsxWithMiddleware: JSXMiddlewareCallback;
    #locationAndDisposal: ReturnType<typeof createLocationSignal>;
    #idCounter: number = 0;

    #stylesheets: StylesheetManager;

    readonly location: Signal<string>;

    constructor(options: WebRuntimeOptions) {
        this.#target = options.root;
        this.#disposeList = [];
        this.#jsxWithMiddleware = createMiddlewarePipeline(
            options.middleware ?? [],
            this.#endJsx.bind(this),
        );

        this.#stylesheets = new StylesheetManager(
            this.#target.ownerDocument,
            options.classNameFormat,
        );

        this.#locationAndDisposal = createLocationSignal();
        this.location = this.#locationAndDisposal.signal;
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
        this.#locationAndDisposal.dispose();
    }

    getPrefixedClassName(cssClass: GlobalCssClass): string {
        return this.#stylesheets.getPrefixedClassName(cssClass);
    }

    addStylesheet(stylesheet: AbstractGlobalCssStylesheet): () => void {
        return this.#stylesheets.addStylesheet(stylesheet);
    }

    removeStylesheet(stylesheet: AbstractGlobalCssStylesheet): void {
        this.#stylesheets.removeStylesheet(stylesheet);
    }

    createNestedRoot(
        target: RuntimeRootHostElement,
        render: () => JSX.Element,
    ) {
        return createNestedRoot(target, render, this);
    }

    topLevelError(err: unknown) {
        console.error('Error escaped', err);
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
            switch (typeof type) {
                case 'function': {
                    // Component function
                    return createComponentInstance(type, props, this);
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
        });

        return result as JSXResultForComponentOrElementType<TComponentType>;
    }

    get type(): symbol {
        return webRuntimeSymbol;
    }

    nextId(basis?: string | undefined): string {
        return `${basis ?? 'generated'}_${++this.#idCounter}`;
    }

    navigate(url: string): void {
        window.history.pushState(undefined, '', url);
        this.#locationAndDisposal.ping();
    }

    createElement(tagName: string): HTMLElement | SVGElement {
        return document.createElement(tagName);
    }

    createComment(content?: string | undefined): Comment {
        return document.createComment('');
    }
}

const createNestedRootLogger = createLogger($insertLocation(), createNestedRoot);

function createNestedRoot(
    target: RuntimeRootHostElement,
    render: () => JSX.Element,
    webRuntime: WebRuntimeImplementation,
) {
    const cleanup = ComponentFaultContext.replace(
        {
            reportFaulted: (err) => {
                webRuntime.topLevelError(err);
            },
        },
        $insertLocation(),
    );
    try {
        const content = render();

        const getContext = Context.createSnapshot();

        announceMountedRecursive(createNestedRootLogger, target);

        const unmount = addJsxChildren(getContext, target, content, webRuntime);

        // Allow callers to be lazy and call the returned callback multiple times
        let unmounted = false;

        return () => {
            if (!unmounted) {
                unmounted = true;

                // unmount children
                unmount();

                // This will mostly unmount the parent
                announceUnMountedRecursive(createNestedRootLogger, target);
            }
        };
    } finally {
        cleanup();
    }
}
