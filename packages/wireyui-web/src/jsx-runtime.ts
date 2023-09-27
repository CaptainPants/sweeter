import {
    Component,
    JSXElement,
    PropsWithIntrinsicAttributesFor,
    flatten,
    FlattenedElement,
    isSignal,
    Signal,
} from '@captainpants/wireyui-core';

function jsx<ComponentType extends string | Component<unknown>>(
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

    appendJsxChildren(ele, null, props.children);

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

/**
 * TODO: we could use a [] stack here to avoid the recursion.
 * @param node
 * @returns
 */
function cleanupRecursive(node: Node) {
    const callbacks = cleanupMap.get(node);

    if (!callbacks || callbacks.length == 0) return;

    cleanupMap.delete(node);

    for (const child of node.childNodes) {
        cleanupRecursive(child);
    }

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
                    (node as unknown as Untyped)[mappedKey] = value.peek();

                    const removeListener = value.listen((_, newValue) => {
                        (node as unknown as Untyped)[mappedKey] = newValue;
                    }, true);
                    // When the DOM element is removed, we stop listening for changes
                    // this in turn will eventually release dependencies for which
                    // there are no further strong references held.
                    addCleanupCallback(node, removeListener);
                } else {
                    (node as unknown as Untyped)[mappedKey] = value;
                }
            }
        }
    }
}

function append(parent: Node, after: Node | null, child: Node) {
    if (after) {
        parent.insertBefore(child, after.nextSibling);
    } else {
        parent.appendChild(child);
    }
}

function addDynamicJsxChild(
    parent: Node,
    after: Node | null,
    children: Signal<JSX.Element>,
): void {
    let lastValue = children.value;

    const startMarker = document.createTextNode('');
    const endMarker = document.createTextNode('');

    append(parent, after, startMarker);
    appendJsxChildren(parent, after, lastValue);
    append(parent, after, endMarker);

    const removeListener = children.listen((newValue) => {
        const thisValue = children.value;

        let current = startMarker.nextSibling;
        while (current && current != endMarker) {
            const next = current.nextSibling;

            cleanupRecursive(current);
            parent.removeChild(current);

            current = next;
        }

        appendJsxChildren(parent, endMarker, lastValue);

        lastValue = thisValue;
    });

    addCleanupCallback(parent, removeListener);
}

function appendJsxChildren(
    parent: Node,
    after: Node | null,
    children: JSX.Element,
): void {
    const callback = (child: FlattenedElement) => {
        if (isSignal(child)) {
            addDynamicJsxChild(parent, after, child);
            return;
        }

        switch (typeof child) {
            case 'undefined':
                break;

            case 'number':
            case 'boolean':
            case 'string':
                append(parent, after, document.createTextNode(String(child)));
                break;

            default:
                append(parent, after, child);
                break;
        }
    };

    flatten(children, callback);
}

// The only documentation I can find on jsxs is https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#always-pass-children-as-props
// which says "The jsxs function indicates that the top array was created by React.".
export { jsx, jsx as jsxs, appendJsxChildren };