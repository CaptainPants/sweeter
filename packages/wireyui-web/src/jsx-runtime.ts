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

        case 'string':
            {
                // intrinsic
                return renderDOMElement(type, props);
            }

        default:
            throw new TypeError(`Unexpected type ${type}`);
    }
}

function renderDOMElement<TElementType extends string>(
    type: TElementType,
    props: PropsWithIntrinsicAttributesFor<TElementType>,
): HTMLElement | SVGElement {
    const ele = document.createElement(type);

    // Assign attributes and set up signals

    for (const key of Object.getOwnPropertyNames(props)) {
        if (key !== 'children') {
            const value = (props as Record<string, unknown>)[key];

            if (key.startsWith('on')) {
                const eventName = key.substring(2);

                ele.addEventListener(eventName, (isSignal(value) ? value.value : value) as EventListener);
                // TODO: cleanup / signal change
            }
            else {
                (props as Record<string, unknown>)[key] = (isSignal(value) ? value.value : value);
                // TODO: cleanup / signal change
            }
        }
    }

    appendJsxChildren(ele, props.children);

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

export function appendJsxChildren(parent: Node, children: JSX.Element): void {
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
