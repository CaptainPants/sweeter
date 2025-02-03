import {
    $controller,
    $insertLocation,
    ComponentFaultContext,
    Context,
    dev,
    type PropsInputFor,
    type Signal,
    SignalState,
} from '@serpentis/ptolemy-core';

import { bindDOMClassProp } from '../../styles/internal/bindDOMClassProp.js';
import { bindDOMStyleProp } from '../../styles/internal/bindDOMStyleProp.js';
import { type WebRuntime } from '../types.js';

import { addJsxChildren } from './addJsxChildren.js';
import { bindDOMMiscProps } from './bindDOMMiscProps.js';
import { bindRef } from './bindRef.js';
import { addMountedCallback } from './mounting.js';

export function createDOMElement<TElementTypeString extends string>(
    type: TElementTypeString,
    props: PropsInputFor<TElementTypeString>,
    webRuntime: WebRuntime,
): Signal<HTMLElement | SVGElement> {
    const resultController = $controller<HTMLElement | SVGElement>();

    const ele = webRuntime.createElement(type);

    const result = $controller(SignalState.success(ele));

    const cleanupFaultContext = ComponentFaultContext.replace(
        {
            reportFaulted(err) {
                console.warn('Fault (createDOMElement): ', err);
                // If its mounted to the document, we can potentially cheat
                // If its not, then we need to make the result invalid -- and currently its a raw DOM Element
                resultController.updateState(SignalState.error(err));
            },
        },
        $insertLocation(),
    );
    try {
        const contextSnapshot = Context.createSnapshot();

        // This has to be before bindDOMMiscProps as value for HTMLSelectElement is dependent on the child element 'option's

        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- We seem to just be choking the lint rule
        addJsxChildren(contextSnapshot, ele, props.children, webRuntime);

        // Assign attributes and set up signals
        bindDOMMiscProps(ele, props, webRuntime);

        if (props.ref) {
            bindRef(ele, props.ref); // TODO: the typing on ref is not correct
        }

        if (props.class) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- We seem to just be choking the lint rule
            bindDOMClassProp(contextSnapshot, ele, props.class, webRuntime);
        }

        if (props.style) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- We seem to just be choking the lint rule
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
