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
    props: PropsWithIntrinsicAttributesFor<ComponentType>,
): JSXElement {
    switch (typeof type) {
        case 'function':
            {
                // Component function
                return renderComponent(type, props);
            }
            break;

        case 'string':
            {
                // intrinsic
                return renderDOMElement(type, props);
            }
            break;

        default:
            throw new TypeError(`Unexpected type ${type}`);
    }
}

function renderDOMElement<Type extends string>(
    type: Type,
    props: PropsWithIntrinsicAttributesFor<Type>,
) {
    const ele = document.createElement(type);
    // assign attributes and set up signals
    return ele;
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
