import {
    untrack,
    type Component,
    type JSXElement,
    type PropsWithIntrinsicAttributesFor,
    ErrorBoundaryContext,
    type WritableSignal,
} from '@captainpants/sweeter-core';
import { renderComponent } from './internal/renderComponent.js';
import { renderDOMElement } from './internal/renderDOMElement.js';
import { type IntrinsicElementTypeMap } from '../IntrinsicElementTypeMap.js';

type MayHaveRef = {
    ref?:
        | ((ele: HTMLElement | SVGElement) => void)
        | WritableSignal<HTMLElement | SVGElement>;
};

type JSXResult<ComponentType extends string | Component<unknown>> =
    ComponentType extends keyof IntrinsicElementTypeMap
        ? IntrinsicElementTypeMap[ComponentType]
        : JSXElement;

export function jsx<ComponentType extends string | Component<unknown>>(
    type: ComponentType,
    props: PropsWithIntrinsicAttributesFor<ComponentType>,
): JSXResult<ComponentType> {
    // Its reasonably certain that people will trigger side effects when wiring up a component
    // and that these might update signals. We also don't want to accidentally subscribe to these
    // signals -- hence untrack the actual render
    const result = untrack(() => {
        try {
            switch (typeof type) {
                case 'function': {
                    // Component function
                    return renderComponent(type, props);
                }

                case 'string': {
                    // intrinsic
                    const element = renderDOMElement(
                        type,
                        props as PropsWithIntrinsicAttributesFor<
                            ComponentType & string
                        >,
                    );
                    const ref = (props as MayHaveRef).ref;
                    if (ref) {
                        if (typeof ref === 'function') {
                            ref(element);
                        } else {
                            ref.update(element);
                        }
                    }

                    return element;
                }

                default:
                    throw new TypeError(`Unexpected type ${type}`);
            }
        } catch (ex) {
            ErrorBoundaryContext.getCurrent().error(ex);
            return 'Error processing...';
        }
    });

    return result as JSXResult<ComponentType>;
}
