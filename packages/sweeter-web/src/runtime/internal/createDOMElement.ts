import {
    $controller,
    ComponentFaultContext,
    Context,
    dev,
    SignalState,
    type PropsWithIntrinsicAttributesFor,
    type Signal,
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
): Signal<HTMLElement | SVGElement> {
    const resultController = $controller<HTMLElement | SVGElement>();

    const ele = webRuntime.createElement(type);

    const result = $controller(SignalState.success(ele));

    const cleanupFaultContext = ComponentFaultContext.replace({
        reportFaulted(err) {
            console.warn('Fault (createDOMElement): ', err);
            // If its mounted to the document, we can potentially cheat
            // If its not, then we need to make the result invalid -- and currently its a raw DOM Element
            resultController.updateState(SignalState.error(err));
        },
    });
    try {
        const contextSnapshot = Context.createSnapshot();

        // This has to be before bindDOMMiscProps as value for HTMLSelectElement is dependent on the child element 'option's
        addJsxChildren(contextSnapshot, ele, props.children, webRuntime);

        // Assign attributes and set up signals
        bindDOMMiscProps(ele, props, webRuntime);

        if (props.ref) {
            if (typeof props.ref === 'function') {
                props.ref(ele);
            } else {
                props.ref.value = ele;
            }
        }

        if (props.class) {
            bindDOMClassProp(contextSnapshot, ele, props.class, webRuntime);
        }

        if (props.style) {
            bindDOMStyleProp(ele, props.style);
        }

        if (dev.flag('componentMounting')) {
            ele.dataset['isMounted'] = '0';

            addMountedCallback(contextSnapshot, ele, () => {
                ele.dataset['isMounted'] = '1';

                return () => {
                    ele.dataset['isMounted'] = '0';
                };
            });
        }

        return result.signal;
    } finally {
        cleanupFaultContext();
    }
}
