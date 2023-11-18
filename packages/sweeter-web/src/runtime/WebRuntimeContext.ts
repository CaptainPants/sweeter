import type {
    Component,
    PropsWithIntrinsicAttributesFor,
} from '@captainpants/sweeter-core';
import { Context } from '@captainpants/sweeter-core';
import type {
    AbstractGlobalCssStylesheet,
    GlobalStyleSheetContentGeneratorContext,
} from '../styles/index.js';

export interface DocumentStylesheetHandle {
    remove(): void;
    update(stylesheet: AbstractGlobalCssStylesheet): void;
}

export interface WebRuntimeContext
    extends GlobalStyleSheetContentGeneratorContext {
    addStylesheet(
        stylesheet: AbstractGlobalCssStylesheet,
    ): DocumentStylesheetHandle;
    createDOMElement<TElementTypeString extends string>(
        type: TElementTypeString,
        props: PropsWithIntrinsicAttributesFor<TElementTypeString>,
    ): HTMLElement | SVGElement;
    createComponent<TComponentType extends Component<unknown>>(
        Component: TComponentType,
        props: PropsWithIntrinsicAttributesFor<TComponentType>,
    ): JSX.Element;
}

export const WebRuntimeContext = new Context<WebRuntimeContext>('WebRuntime', {
    addStylesheet() {
        throw new TypeError('Not implemented');
    },
    getPrefixedClassName(cssClass) {
        throw new TypeError('Not implemented');
    },
    createDOMElement<TElementTypeString extends string>(
        type: TElementTypeString,
        props: PropsWithIntrinsicAttributesFor<TElementTypeString>,
    ): HTMLElement | SVGElement {
        throw new TypeError('Not implemented');
    },
    createComponent<TComponentType extends Component<unknown>>(
        Component: TComponentType,
        props: PropsWithIntrinsicAttributesFor<TComponentType>,
    ): JSX.Element {
        throw new TypeError('Not implemented');
    },
});
