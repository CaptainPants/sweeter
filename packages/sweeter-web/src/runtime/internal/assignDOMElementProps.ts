import type { PropsWithIntrinsicAttributesFor } from '@captainpants/sweeter-core';
import {
    addExplicitStrongReference,
    isReadWriteSignal,
    isSignal,
} from '@captainpants/sweeter-core';
import { bindStyle } from './bindStyle.js';
import { type Styles } from '../../IntrinsicAttributes.js';
import { flattenCssClasses } from '../../styles/flattenCssClasses.js';
import type { ElementCssClasses } from '../../styles/index.js';
import type { WebRuntimeContext } from '../WebRuntimeContext.js';

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
    runtimeContext: WebRuntimeContext,
): void {
    for (const key of Object.getOwnPropertyNames(props)) {
        // Deal with class (className) and for (htmlFor)
        const mappedKey = Object.hasOwn(mappedProperties, key)
            ? mappedProperties[key]!
            : key;

        if (mappedKey === 'children' || mappedKey === 'ref') {
            continue;
        }

        let mutableValue = (props as Untyped)[key];

        if (key === 'class') {
            // Special handling of cssClass
            mutableValue = flattenCssClasses(
                mutableValue as ElementCssClasses,
                runtimeContext,
            );
        }

        // just makes a lot of later stuff easier if the value is a constant (callbacks can see the narrowed value)
        const constantValue = mutableValue;

        const mutableMapEntry = mutableMap.get(mappedKey);

        if (mutableMapEntry && isSignal(constantValue)) {
            // ==== MUTABLE SIGNAL SPECIAL CASE BINDING (e.g. input.value) ====
            const { eventName, domProperty } = mutableMapEntry;

            node.addEventListener(eventName, (evt) => {
                // It might be a readonly signal, in which case we can't update it.
                // we should actually ignore attempts to write it in this case..
                if (isReadWriteSignal(constantValue)) {
                    const updatedValue = (
                        evt.currentTarget as unknown as Record<string, unknown>
                    )[domProperty];

                    constantValue.update(updatedValue);
                } else {
                    // Reset
                    (evt.currentTarget as unknown as Record<string, unknown>)[
                        domProperty
                    ] = constantValue.value;
                }
            });
            const changeCallback = () => {
                (node as unknown as Untyped)[mappedKey] = constantValue.peek();
            };

            // Add a weak listener (so that it will be cleaned up when no references held)
            // we will add a strong reference to the DOM element (via WeakMap) to prevent
            // cleanup until the DOM element is no longer reachable
            constantValue.listen(changeCallback, false);

            addExplicitStrongReference(node, changeCallback);
        } else if (
            mappedKey === 'style' &&
            (node instanceof HTMLElement || node instanceof SVGElement)
        ) {
            // ==== STYLES BINDING ====
            bindStyle(node, constantValue as Styles);
        } else if (mappedKey.startsWith('on')) {
            // ==== EVENT HANDLER BINDING ====

            const eventName = mappedKey.substring(2);

            // We don't need to subscribe, we can just use the current value of
            // the signal when an event is triggered.
            if (isSignal(constantValue)) {
                // Indirect via anonymous callback
                // This closure captures 'value'
                node.addEventListener(eventName, (evt) => {
                    (constantValue.peek() as EventListener)(evt);
                });
            } else {
                // More direct path if not a signal
                node.addEventListener(
                    eventName,
                    constantValue as EventListener,
                );
            }
        } else {
            // ==== NORMAL SIGNAL BINDING ====
            if (isSignal(constantValue)) {
                (node as unknown as Untyped)[mappedKey] = constantValue.peek();

                const changeCallback = () => {
                    (node as unknown as Untyped)[mappedKey] =
                        constantValue.peek();
                };

                // Add a weak listener (so that it will be cleaned up when no references held)
                // we will add a strong reference to the DOM element (via WeakMap) to prevent
                // cleanup until the DOM element is no longer reachable
                constantValue.listen(changeCallback, false);

                addExplicitStrongReference(node, changeCallback);
            } else {
                (node as unknown as Untyped)[mappedKey] = constantValue;
            }
        }
    }
}
