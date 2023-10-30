import type { PropsWithIntrinsicAttributesFor } from '@captainpants/wireyui-core';
import { assignDOMElementProps } from './assignDOMElementProps.js';
import { addJsxChildren } from './addJsxChildren.js';

export function renderDOMElement<TElementTypeString extends string>(
    type: TElementTypeString,
    props: PropsWithIntrinsicAttributesFor<TElementTypeString>,
): HTMLElement | SVGElement {
    const ele = document.createElement(type);

    // Assign attributes and set up signals
    assignDOMElementProps(ele, props);

    addJsxChildren(ele, props.children);

    return ele;
}
