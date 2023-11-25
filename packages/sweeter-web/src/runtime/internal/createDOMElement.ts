import {
    Context,
    type PropsWithIntrinsicAttributesFor,
} from '@captainpants/sweeter-core';
import { bindDOMMiscProps } from './bindDOMMiscProps.js';
import { addJsxChildren } from './addJsxChildren.js';
import { type WebRuntime } from '../types.js';
import { bindDOMClassProp } from './bindDOMClassProp.js';
import { bindDOMStyleProp } from './bindDOMStyleProp.js';

export function createDOMElement<TElementTypeString extends string>(
    type: TElementTypeString,
    props: PropsWithIntrinsicAttributesFor<TElementTypeString>,
    webRuntime: WebRuntime,
): HTMLElement | SVGElement {
    const ele = document.createElement(type);

    // Assign attributes and set up signals
    bindDOMMiscProps(ele, props, webRuntime);

    if (props.ref) {
        if (typeof props.ref === 'function') {
            props.ref(ele);
        } else {
            props.ref.update(ele);
        }
    }

    if (props.class) {
        const contextSnapshot = Context.createSnapshot();
        bindDOMClassProp(contextSnapshot, ele, props.class, webRuntime);
    }

    if (props.style) {
        bindDOMStyleProp(ele, props.style);
    }

    addJsxChildren(ele, props.children, webRuntime);

    return ele;
}
