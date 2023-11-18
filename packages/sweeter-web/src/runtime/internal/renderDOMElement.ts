import type { PropsWithIntrinsicAttributesFor } from '@captainpants/sweeter-core';
import { assignDOMElementProps } from './assignDOMElementProps.js';
import { addJsxChildren } from './addJsxChildren.js';
import { type WebRuntimeContext } from '../WebRuntimeContext.js';

export function renderDOMElement<TElementTypeString extends string>(
    type: TElementTypeString,
    props: PropsWithIntrinsicAttributesFor<TElementTypeString>,
    webRuntimeContext: WebRuntimeContext,
): HTMLElement | SVGElement {
    const ele = document.createElement(type);

    // Assign attributes and set up signals
    assignDOMElementProps(ele, props, webRuntimeContext);

    addJsxChildren(ele, props.children);

    return ele;
}
