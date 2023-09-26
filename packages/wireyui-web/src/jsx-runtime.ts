import {
    Component,
    JSXElement,
    PropsWithIntrinsicAttributesFor,
    flatten,
    FlattenedElement,
    isSignal,
} from '@captainpants/wireyui-core';

export function jsx<ComponentType extends string | Component<unknown>>(
    type: ComponentType,
    props: PropsWithIntrinsicAttributesFor<ComponentType>,
): JSXElement {
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

const mappedProperties: Record<string, string> = {
    class: 'className',
    for: 'htmlFor',
};

function renderDOMElement<TElementType extends string>(
    type: TElementType,
    props: PropsWithIntrinsicAttributesFor<TElementType>,
): HTMLElement | SVGElement {
    const ele = document.createElement(type);

    // Assign attributes and set up signals
    assignDOMElementProps(ele, props);

    appendJsxChildren(ele, props.children);

    return ele;
}

function renderComponent<TComponentType extends Component<unknown>>(
    Component: TComponentType,
    props: PropsWithIntrinsicAttributesFor<TComponentType>,
): JSXElement {
    const res = Component(props, {});

    return res;
}

function assignDOMElementProps<TElementType extends string>(
    ele: Node,
    props: PropsWithIntrinsicAttributesFor<TElementType>,
): void {
    for (const key of Object.getOwnPropertyNames(props)) {
        // Deal with class (className) and for (htmlFor)
        const mappedKey = Object.hasOwn(mappedProperties, key)
            ? mappedProperties[key]!
            : key;

        if (mappedKey !== 'children') {
            const value = (props as Record<string, unknown>)[mappedKey];

            if (mappedKey.startsWith('on')) {
                const eventName = mappedKey.substring(2);

                if (isSignal(value)) {
                    // Indirect via anonymous callback
                    ele.addEventListener(eventName, (evt) => {
                        (value.value as EventListener)(evt);
                    });
                } else {
                    // More direct path if not a signal
                    ele.addEventListener(eventName, value as EventListener);
                }
            } else {
                if (isSignal(value)) {
                    (props as Record<string, unknown>)[mappedKey] =
                        value.peek();
                    value.listen((_, newValue) => {
                        (props as Record<string, unknown>)[mappedKey] =
                            newValue;
                    });
                } else {
                    (props as Record<string, unknown>)[mappedKey] = value;
                }
            }
        }
    }
}

export function appendJsxChildren(parent: Node, children: JSX.Element): void {
    const callback = (child: FlattenedElement) => {
        if (isSignal(child)) {
            // TODO: cleanup / signal change
            flatten(child.value, callback);
            return;
        }

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
    };

    flatten(children, callback);
}
