import type { PropsWithIntrinsicAttributesFor } from '@captainpants/wireyui-core';
import { assignDOMElementProps } from './assignDOMElementProps.js';
import { addJsxChildren } from './addJsxChildren.js';

export function renderDOMElement<TElementType extends string>(
    type: TElementType,
    props: PropsWithIntrinsicAttributesFor<TElementType>,
): HTMLElement | SVGElement {
    const ele = document.createElement(type);

    // Assign attributes and set up signals
    assignDOMElementProps(ele, props);

    addJsxChildren(ele, props.children);

    return ele;
}
