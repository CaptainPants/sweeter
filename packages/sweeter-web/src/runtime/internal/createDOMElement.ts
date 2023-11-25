import {
    Context,
    type PropsWithIntrinsicAttributesFor,
} from '@captainpants/sweeter-core';
import { assignDOMElementProps } from './assignDOMElementProps.js';
import { addJsxChildren } from './addJsxChildren.js';
import { type WebRuntime } from '../types.js';
import { applyClassProp } from './applyClassProp.js';

export function createDOMElement<TElementTypeString extends string>(
    type: TElementTypeString,
    props: PropsWithIntrinsicAttributesFor<TElementTypeString>,
    webRuntime: WebRuntime,
): HTMLElement | SVGElement {
    const ele = document.createElement(type);

    // Assign attributes and set up signals
    assignDOMElementProps(ele, props, webRuntime);

    if (props.ref) {
        if (typeof props.ref === 'function') {
            props.ref(ele);
        } else {
            props.ref.update(ele);
        }
    }

    if (props.class) {
        applyClassProp(Context.createSnapshot(), ele, props.class, webRuntime);
    }

    addJsxChildren(ele, props.children, webRuntime);

    return ele;
}
