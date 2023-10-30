import {
    untrack,
    type Component,
    type JSXElement,
    type PropsWithIntrinsicAttributesFor,
    ErrorBoundaryContext,
    Fragment,
    type MutableSignal,
} from '@captainpants/wireyui-core';
import { renderComponent } from './internal/renderComponent.js';
import { renderDOMElement } from './internal/renderDOMElement.js';
import { type IntrinsicElementTypeMap } from '../IntrinsicElementTypeMap.js';

type HasRef = {
    ref?:
        | ((ele: HTMLElement | SVGElement) => void)
        | MutableSignal<HTMLElement | SVGElement>;
};

type JSXResult<ComponentType extends string | Component<unknown>> =
    ComponentType extends keyof IntrinsicElementTypeMap
        ? IntrinsicElementTypeMap[ComponentType]
        : JSXElement;

function jsx<ComponentType extends string | Component<unknown>>(
    type: ComponentType,
    props: PropsWithIntrinsicAttributesFor<ComponentType>,
): JSXResult<ComponentType> {
    const result = untrack(() => {
        try {
            if (type === undefined) {
                return jsx(Fragment, props);
            }

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
                    const ref = (props as HasRef).ref;
                    if (ref) {
                        if (typeof ref === 'function') {
                            ref(element);
                        } else {
                            ref.value = element;
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

// The only documentation I can find on jsxs is https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#always-pass-children-as-props
// which says "The jsxs function indicates that the top array was created by React.".
export { jsx, jsx as jsxs };
