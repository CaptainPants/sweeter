import type { PropsWithIntrinsicAttributesFor } from '@captainpants/wireyui-core';
import {
    addStrongReference,
    isReadWriteSignal,
    isSignal,
} from '@captainpants/wireyui-core';

type Untyped = Record<string, unknown>;

const mappedProperties: Record<string, string> = {
    class: 'className',
    for: 'htmlFor',
};

interface MutableMapping {
    eventName: string;
    domProperty: string;
}

const mutableMap = new Map<string, MutableMapping>([
    ['value', { eventName: 'input', domProperty: 'value' }],
    ['checked', { eventName: 'change', domProperty: 'checked' }],
]);

export function assignDOMElementProps<TElementType extends string>(
    node: Node,
    props: PropsWithIntrinsicAttributesFor<TElementType>,
): void {
    for (const key of Object.getOwnPropertyNames(props)) {
        // Deal with class (className) and for (htmlFor)
        const mappedKey = Object.hasOwn(mappedProperties, key)
            ? mappedProperties[key]!
            : key;

        if (mappedKey === 'children' || mappedKey === 'ref') {
            continue;
        }

        const value = (props as Untyped)[mappedKey];

        const mutableMapEntry = mutableMap.get(mappedKey);

        if (mutableMapEntry && isSignal(value)) {
            // ==== MUTABLE SIGNAL SPECIAL CASE BINDING (e.g. input.value) ====
            const { eventName, domProperty } = mutableMapEntry;

            node.addEventListener(eventName, (evt) => {
                // It might be a readonly signal, in which case we can't update it.
                // we should actually ignore attempts to write it in this case..
                if (isReadWriteSignal(value)) {
                    const updatedValue = (
                        evt.currentTarget as unknown as Record<string, unknown>
                    )[domProperty];

                    value.value = updatedValue;
                } else {
                    // Reset
                    (evt.currentTarget as unknown as Record<string, unknown>)[
                        domProperty
                    ] = value.value;
                }
            });
            const changeCallback = () => {
                (node as unknown as Untyped)[mappedKey] = value.peek();
            };

            // Add a weak listener (so that it will be cleaned up when no references held)
            // we will add a strong reference to the DOM element (via WeakMap) to prevent
            // cleanup until the DOM element is no longer reachable
            value.listen(changeCallback, false);

            addStrongReference(node, changeCallback);
        } else if (mappedKey === 'style') {
            // ==== STYLES BINDING ====
            // TODO: magic for styles
            
        } else if (mappedKey.startsWith('on')) {
            // ==== EVENT HANDLER BINDING ====

            const eventName = mappedKey.substring(2);

            // We don't need to subscribe, we can just use the current value of
            // the signal when an event is triggered.
            if (isSignal(value)) {
                // Indirect via anonymous callback
                // This closure captures 'value'
                node.addEventListener(eventName, (evt) => {
                    (value.peek() as EventListener)(evt);
                });
            } else {
                // More direct path if not a signal
                node.addEventListener(eventName, value as EventListener);
            }
        } else {
            // ==== NORMAL SIGNAL BINDING ====
            if (isSignal(value)) {
                (node as unknown as Untyped)[mappedKey] = value.peek();

                const changeCallback = () => {
                    (node as unknown as Untyped)[mappedKey] = value.peek();
                };

                // Add a weak listener (so that it will be cleaned up when no references held)
                // we will add a strong reference to the DOM element (via WeakMap) to prevent
                // cleanup until the DOM element is no longer reachable
                value.listen(changeCallback, false);

                addStrongReference(node, changeCallback);
            } else {
                (node as unknown as Untyped)[mappedKey] = value;
            }
        }
    }
}
