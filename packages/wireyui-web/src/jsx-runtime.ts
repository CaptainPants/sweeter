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

const strongReferences = new WeakMap<Node, unknown[]>();
function addStrongReference(node: Node, ref: unknown): void {
    const found = strongReferences.get(node);
    if (found) {
        found.push(ref);
    } else {
        const toAdd = [ref];
        strongReferences.set(node, toAdd);
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

                    // Add a weak listener (so that it will be cleaned up when no references held)
                    // we will add a strong reference to the DOM element (via WeakMap) to prevent
                    // cleanup until the DOM element is no longer reachable
                    value.listen((_, newValue) => {
                        (node as unknown as Untyped)[mappedKey] = newValue;
                    }, false);

                    addStrongReference(node, value);
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

function addSignalJsxChild(
    parent: Node,
    after: Node | null,
    childSignal: Signal<JSX.Element>,
): void {
    let lastValue = childSignal.value;

    // JSX.Element signals use a Comment as the start/end 
    // marker as they do not participate in layout.
    const startMarker = document.createComment('{');
    const endMarker = document.createComment('}');

    append(parent, after, startMarker);
    appendJsxChildren(parent, after, lastValue);
    append(parent, after, endMarker);

    const dynamicJsxChildCleanupAndReplace = () => {
        const thisValue = childSignal.value;

        // From 'startMarker', delete all nextSiblings until 'endMarker'
        let current = startMarker.nextSibling;

        while (current && current != endMarker) {
            const next = current.nextSibling;

            parent.removeChild(current);

            current = next;
        }

        appendJsxChildren(parent, endMarker, thisValue);

        lastValue = thisValue;
    };
    // Holds a strong reference to this callback
    childSignal.listen(dynamicJsxChildCleanupAndReplace, true);

    // Keep the signal and the handler alive
    // technically childSignal will hold a reference to 
    // dynamicJsxChildCleanupAndReplace so the extra reference
    // isn't necessary
    addStrongReference(parent, childSignal);
}

function appendJsxChildren(
    parent: Node,
    after: Node | null,
    children: JSX.Element,
): void {
    const callback = (child: FlattenedElement) => {
        if (isSignal(child)) {
            addSignalJsxChild(parent, after, child);
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
