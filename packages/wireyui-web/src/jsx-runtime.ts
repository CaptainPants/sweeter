import {
    Component,
    JSXElement,
    PropsWithIntrinsicAttributesFor,
    flatten,
    isSignal,
} from '@captainpants/wireyui-core';

export function jsx<ComponentType extends string | Component<unknown>>(
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

function renderDOMElement<TElementType extends string>(
    type: TElementType,
    props: PropsWithIntrinsicAttributesFor<TElementType>,
): HTMLElement | SVGElement {
    const ele = document.createElement(type);

    // assign attributes and set up signals

    addChildren(ele, props.children);

    return ele;
}

function renderComponent<TComponentType extends Component<unknown>>(
    Component: TComponentType,
    props: PropsWithIntrinsicAttributesFor<TComponentType>,
): JSXElement {
    const res = Component(props, {});

    if (isSignal(res)) {
        // signal means the result can change and we need to handle that..
        return res.value;
    } else if (Array.isArray(res)) {
        // static element/list of element result
        return res.map((x) => (isSignal(x) ? x.value : x));
    } else {
        return res;
    }
}

function addChildren(parent: Node, children: JSX.Element): void {
    flatten(children, (child) => {
        switch (typeof child) {
            case 'undefined':
                break;

            case 'number':
            case 'boolean':
            case 'string':
                parent.appendChild(document.createElement(String(child)));
                break;

            default:
                parent.appendChild(child);
                break;
        }
    });
}
