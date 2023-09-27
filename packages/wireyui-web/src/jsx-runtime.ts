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

type Untyped = Record<string, unknown>;

const cleanupMap = new WeakMap<Node, (() => void)[]>();
function addCleanupCallback(node: Node, callback: () => void): void {
    const found = cleanupMap.get(node);
    if (found) {
        found.push(callback);
    } else {
        const toAdd = [callback];
        cleanupMap.set(node, toAdd);
    }
}
function cleanup(node: Node) {
    const callbacks = cleanupMap.get(node);
    if (!callbacks || callbacks.length == 0) return;

    for (const item of callbacks) {
        try {
            item();
        } catch (ex) {
            console.error(
                'Error swallowed while cleaning up DOM element',
                ex,
                node,
            );
        }
    }
}

function assignDOMElementProps<TElementType extends string>(
    node: Node,
    props: PropsWithIntrinsicAttributesFor<TElementType>,
): void {
    for (const key of Object.getOwnPropertyNames(props)) {
        // Deal with class (className) and for (htmlFor)
        const mappedKey = Object.hasOwn(mappedProperties, key)
            ? mappedProperties[key]!
            : key;

        if (mappedKey !== 'children') {
            const value = (props as Untyped)[mappedKey];

            if (mappedKey.startsWith('on')) {
                const eventName = mappedKey.substring(2);

                // We don't need to subscribe, we can just use the current value of 
                // the signal.
                if (isSignal(value)) {
                    // Indirect via anonymous callback
                    node.addEventListener(eventName, (evt) => {
                        (value.peek() as EventListener)(evt);
                    });
                } else {
                    // More direct path if not a signal
                    node.addEventListener(eventName, value as EventListener);
                }
            } else {
                if (isSignal(value)) {
                    (props as Untyped)[mappedKey] = value.peek();

                    const removeListener = value.listen((_, newValue) => {
                        (props as Untyped)[mappedKey] = newValue;
                    }, true);
                    // When the DOM element is removed, we stop listening for changes
                    // this in turn will eventually release dependencies for which
                    // there are no further strong references held.
                    addCleanupCallback(node, removeListener);
                } else {
                    (props as Untyped)[mappedKey] = value;
                }
            }
        }
    }
}

export function appendJsxChildren(parent: Node, children: JSX.Element): void {
    const callback = (child: FlattenedElement) => {
        if (isSignal(child)) {
            let lastValue = child.value;

            flatten(child.value, callback);

            const removeListener = child.listen((newValue) => {
                // TODO: cleanup / signal change
                console.log('lastValue: ', lastValue);
                console.log('cleanup: ', cleanup);

                const thisValue = child.value;

                flatten(thisValue, callback);

                lastValue = thisValue;
            });

            addCleanupCallback(parent, removeListener);

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
