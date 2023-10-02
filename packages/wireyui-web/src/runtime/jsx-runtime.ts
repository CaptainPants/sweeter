import {
    addStrongReference,
    flatten,
    isSignal,
} from '@captainpants/wireyui-core';
import type {
    Component,
    JSXElement,
    PropsWithIntrinsicAttributesFor,
    FlattenedElement,
    Signal,
} from '@captainpants/wireyui-core';
import { renderComponent } from './renderComponent.js';
import { assignDOMElementProps } from './assignDOMElementProps.js';

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

function append(parent: Node, after: Node | null, child: Node): Node {
    if (after) {
        parent.insertBefore(child, after.nextSibling);
    } else {
        parent.appendChild(child);
    }
    return child;
}

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

function addSignalJsxChild(
    parent: Node,
    after: Node | null,
    childSignal: Signal<JSX.Element>,
): Node {
    let lastValue = childSignal.value;

    // JSX.Element signals use a Comment as the start/end
    // marker as they do not participate in layout.
    const startMarker = document.createComment('{');
    const endMarker = document.createComment('}');

    append(parent, after, startMarker);
    const afterChildren = appendJsxChildren(parent, startMarker, lastValue);
    append(parent, afterChildren, endMarker);

    // TODO: dynamic text is currently getting removed and re-added,
    // and thats not great for performance. We need to do some kind of
    // reconciliation to take that into account.

    // I think that flatten probably needs to return an array/callback
    // (which is then in turn returned by appendJsxChildren) that can
    // be used to reconcile between runs.

    const dynamicJsxChildCleanupAndReplace = () => {
        const thisValue = childSignal.value;

        // From 'startMarker', delete all nextSiblings until 'endMarker'
        let current = startMarker.nextSibling;

        while (current && current != endMarker) {
            parent.removeChild(current);

            current = startMarker.nextSibling;
        }

        appendJsxChildren(parent, startMarker, thisValue);

        lastValue = thisValue;
    };

    // Signal could be used in more than one place, so we want
    // to allow this listener to be collected (hence weak)
    childSignal.listen(dynamicJsxChildCleanupAndReplace, false);

    // But add a strong reference to the handler on the DOM
    // element so it will be cleaned up when possible
    addStrongReference(parent, dynamicJsxChildCleanupAndReplace);

    return endMarker;
}

function appendJsxChildren(
    parent: Node,
    after: Node | null,
    children: JSX.Element,
): Node | null {
    let last: Node | null = after;

    const callback = (child: FlattenedElement) => {
        if (isSignal(child)) {
            last = addSignalJsxChild(parent, last, child);
            return;
        }

        switch (typeof child) {
            case 'undefined':
                break;

            case 'number':
            case 'boolean':
            case 'string':
                last = append(
                    parent,
                    last,
                    document.createTextNode(String(child)),
                );
                return;

            default:
                last = append(parent, last, child);
                return;
        }
    };

    flatten(children, callback);

    return last;
}

// The only documentation I can find on jsxs is https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md#always-pass-children-as-props
// which says "The jsxs function indicates that the top array was created by React.".
export { jsx, jsx as jsxs, appendJsxChildren };
