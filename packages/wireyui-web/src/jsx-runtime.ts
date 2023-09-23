import {
    Component,
    ComponentOrIntrinsicElementTypeConstraint,
    JSXElement,
    PropsWithIntrinsicAttributesFor,
    isSignal,
} from '@captainpants/wireyui-core';

export function jsx<
    ComponentType extends ComponentOrIntrinsicElementTypeConstraint,
>(
    type: ComponentType,
    attributes: PropsWithIntrinsicAttributesFor<ComponentType>,
): JSXElement {
    switch (typeof type) {
        case 'function':
            {
                // Component function
                return renderComponent(type, attributes);
            }
            break;

        case 'string':
            {
                // intrinsic
                return document.createElement(type);
            }
            break;

        default:
            throw new TypeError(`Unexpected type ${type}`);
    }
}

function renderComponent<ComponentType extends Component<unknown>>(
    Component: ComponentType,
    props: PropsWithIntrinsicAttributesFor<ComponentType>,
): JSXElement {
    const res = Component(props, {});

    if (isSignal(res)) {
        // signal means the result can change and we need to handle that..
    } else {
        // static element/list of element result
    }

    return res;
}
