import {
    Context,
    dev,
    type PropsWithIntrinsicAttributesFor,
} from '@captainpants/sweeter-core';
import { bindDOMMiscProps } from './bindDOMMiscProps.js';
import { addJsxChildren } from './addJsxChildren.js';
import { type WebRuntime } from '../types.js';
import { bindDOMClassProp } from '../../styles/internal/bindDOMClassProp.js';
import { bindDOMStyleProp } from '../../styles/internal/bindDOMStyleProp.js';
import { addMountedCallback } from './mounting.js';

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

    if (dev.isEnabled) {
        ele.dataset['isMounted'] = '0';

        const contextSnapshot = Context.createSnapshot();
        addMountedCallback(contextSnapshot, ele, () => {
            ele.dataset['isMounted'] = '1';

            return () => {
                ele.dataset['isMounted'] = '0';
            };
        });
    }

    return ele;
}
