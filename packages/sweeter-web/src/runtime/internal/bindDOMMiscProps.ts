import type { PropsWithIntrinsicAttributesFor } from '@captainpants/sweeter-core';
import {
    addExplicitStrongReference,
    isReadWriteSignal,
    isSignal,
} from '@captainpants/sweeter-core';
import { type WebRuntime } from '../types.js';

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

const specialHandlingProps = ['children', 'ref', 'class', 'style'];

export function bindDOMMiscProps<TElementType extends string>(
    node: Node,
    props: PropsWithIntrinsicAttributesFor<TElementType>,
    runtime: WebRuntime,
): void {
    for (const key of Object.getOwnPropertyNames(props)) {
        if (specialHandlingProps.includes(key)) {
            continue;
        }

        // Deal with class (className) and for (htmlFor)
        const mappedKey = Object.hasOwn(mappedProperties, key)
            ? mappedProperties[key]!
            : key;

        const value = (props as Untyped)[key];

        const mutableMapEntry = mutableMap.get(mappedKey);

        if (mutableMapEntry && isSignal(value)) {
            // ==== MUTABLE SIGNAL SPECIAL CASE BINDING (e.g. input.value) ====
            const { eventName, domProperty } = mutableMapEntry;
            
            (node as unknown as Untyped)[domProperty] = value.peek();

            node.addEventListener(eventName, (evt) => {
                // It might be a readonly signal, in which case we can't update it.
                // we should actually ignore attempts to write it in this case..
                if (isReadWriteSignal(value)) {
                    const updatedValue = (
                        evt.currentTarget as unknown as Record<string, unknown>
                    )[domProperty];

                    value.update(updatedValue);
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

            addExplicitStrongReference(node, changeCallback);
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

                addExplicitStrongReference(node, changeCallback);
            } else {
                (node as unknown as Untyped)[mappedKey] = value;
            }
        }
    }
}
