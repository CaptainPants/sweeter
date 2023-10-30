import type { PropsWithIntrinsicAttributesFor } from '@captainpants/wireyui-core';
import {
    addStrongReference,
    isMutableSignal,
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

export function assignDOMElementProps<TElementTypeString extends string>(
    node: Node,
    props: PropsWithIntrinsicAttributesFor<TElementTypeString>,
): void {
    for (const key of Object.getOwnPropertyNames(props)) {
        // Deal with class (className) and for (htmlFor)
        const mappedKey = Object.hasOwn(mappedProperties, key)
            ? mappedProperties[key]!
            : key;

        if (mappedKey !== 'children') {
            const value = (props as Untyped)[mappedKey];

            const mutableMapEntry = mutableMap.get(mappedKey);

            if (mutableMapEntry && isMutableSignal(value)) {
                const { eventName, domProperty } = mutableMapEntry;

                node.addEventListener(eventName, (evt) => {
                    const updatedValue = (
                        evt as Event & {
                            currentTarget: Record<string, unknown>;
                        }
                    ).currentTarget[domProperty];
                    value.value = updatedValue;
                });
                const changeCallback = () => {
                    (node as unknown as Untyped)[mappedKey] = value.peek();
                };

                // Add a weak listener (so that it will be cleaned up when no references held)
                // we will add a strong reference to the DOM element (via WeakMap) to prevent
                // cleanup until the DOM element is no longer reachable
                value.listen(changeCallback, false);

                addStrongReference(node, changeCallback);
            } else if (mappedKey.startsWith('on')) {
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
}
