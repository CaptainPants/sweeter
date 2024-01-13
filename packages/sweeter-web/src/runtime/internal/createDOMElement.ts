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

    // This has to be before bindDOMMiscProps as value for HTMLSelectElement is dependent on the child element 'option's
    addJsxChildren(ele, props.children, webRuntime);

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

    return ele;
}
