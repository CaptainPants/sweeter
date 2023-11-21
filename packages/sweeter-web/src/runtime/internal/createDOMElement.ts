import type {
    PropsWithIntrinsicAttributesFor,
    WritableSignal,
} from '@captainpants/sweeter-core';
import { assignDOMElementProps } from './assignDOMElementProps.js';
import { addJsxChildren } from './addJsxChildren.js';
import { type WebRuntime } from '../types.js';

type MayHaveRef = {
    ref?:
        | ((ele: HTMLElement | SVGElement) => void)
        | WritableSignal<HTMLElement | SVGElement>;
};

export function createDOMElement<TElementTypeString extends string>(
    type: TElementTypeString,
    props: PropsWithIntrinsicAttributesFor<TElementTypeString>,
    webRuntime: WebRuntime,
): HTMLElement | SVGElement {
    const ele = document.createElement(type);

    // Assign attributes and set up signals
    assignDOMElementProps(ele, props, webRuntime);

    addJsxChildren(ele, props.children, webRuntime);

    const ref = (props as MayHaveRef).ref;
    if (ref) {
        if (typeof ref === 'function') {
            ref(ele);
        } else {
            ref.update(ele);
        }
    }

    return ele;
}
