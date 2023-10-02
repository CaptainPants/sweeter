import type { PropsWithIntrinsicAttributesFor } from '@captainpants/wireyui-core';
import { assignDOMElementProps } from './assignDOMElementProps.js';
import { appendJsxChildren } from './appendJsxChildren.js';

export function renderDOMElement<TElementType extends string>(
    type: TElementType,
    props: PropsWithIntrinsicAttributesFor<TElementType>,
): HTMLElement | SVGElement {
    const ele = document.createElement(type);

    // Assign attributes and set up signals
    assignDOMElementProps(ele, props);

    appendJsxChildren(ele, null, props.children);

    return ele;
}
