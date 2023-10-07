import {
    untrack,
    type Component,
    type JSXElement,
    type PropsWithIntrinsicAttributesFor,
    ErrorBoundaryContext,
} from '@captainpants/wireyui-core';
import { renderComponent } from './internal/renderComponent.js';
import { renderDOMElement } from './internal/renderDOMElement.js';

function jsx<ComponentType extends string | Component<unknown>>(
    type: ComponentType,
    props: PropsWithIntrinsicAttributesFor<ComponentType>,
): JSXElement {
    return untrack(() => {
        try {
            switch (typeof type) {
                case 'function': {
                    // Component function
                    return renderComponent(type, props);
                }
        
                case 'string': {
                    // intrinsic
                    return renderDOMElement(
                        type,
                        props as PropsWithIntrinsicAttributesFor<
                            ComponentType & string
                        >,
                    );
                }
        
                default:
                    throw new TypeError(`Unexpected type ${type}`);
            }
        }
        catch (ex) {
            ErrorBoundaryContext.getCurrent().error(ex);
            return 'Error processing...';
        }
    });
}

// The only documentation I can find on jsxs is https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#always-pass-children-as-props
// which says "The jsxs function indicates that the top array was created by React.".
export { jsx, jsx as jsxs };
