import type { PropsWithIntrinsicAttributesFor } from '@captainpants/sweeter-core';
import { assignDOMElementProps } from './assignDOMElementProps.js';
import { addJsxChildren } from './addJsxChildren.js';
import { type WebRuntime } from '../WebRuntime.js';

export function createDOMElement<TElementTypeString extends string>(
    type: TElementTypeString,
    props: PropsWithIntrinsicAttributesFor<TElementTypeString>,
    webRuntime: WebRuntime,
): HTMLElement | SVGElement {
    const ele = document.createElement(type);

    // Assign attributes and set up signals
    assignDOMElementProps(ele, props, webRuntime);

    addJsxChildren(ele, props.children, webRuntime);

    return ele;
}
