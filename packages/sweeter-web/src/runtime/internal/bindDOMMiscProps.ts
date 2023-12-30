import type { PropsWithIntrinsicAttributesFor } from '@captainpants/sweeter-core';
import {
    addExplicitStrongReference,
    isReadWriteSignal,
    isSignal,
} from '@captainpants/sweeter-core';
import { type WebRuntime } from '../types.js';
import { indeterminite } from '../../indeterminate.js';

type Untyped = Record<string, unknown>;

const mappedProperties: Record<string, string> = {
    class: 'className',
    for: 'htmlFor',
};

interface MutableMapping {
    eventName: string;
    setDomProperty: (ele: unknown, value: unknown) => void;
    getDomProperty: (ele: unknown) => unknown;
}

type HTMLInputTextAreaOrSelect =
    | HTMLInputElement
    | HTMLTextAreaElement
    | HTMLSelectElement;

const bindableMap = new Map<string, MutableMapping>([
    [
        'value',
        {
            eventName: 'input',
            getDomProperty: (ele) => (ele as HTMLInputTextAreaOrSelect).value,
            setDomProperty: (ele, value) => {
                (ele as HTMLInputTextAreaOrSelect).value = String(value);
            },
        },
    ],
    [
        'checked',
        {
            eventName: 'input',
            setDomProperty: (ele, value) => {
                if (value === indeterminite) {
                    (ele as HTMLInputElement).indeterminate = true;
                } else {
                    (ele as HTMLInputElement).checked = Boolean(value);
                }
            },
            getDomProperty: (ele) => {
                if ((ele as HTMLInputElement).indeterminate) {
                    return indeterminite;
                }
                return (ele as HTMLInputElement).checked;
            },
        },
    ],
]);

const specialHandlingProps = ['children', 'ref', 'class', 'style'];
const causesReadonlyIfOneWayBound = ['checked', 'value'];

export function bindDOMMiscProps<TElementType extends string>(
    node: Node,
    props: PropsWithIntrinsicAttributesFor<TElementType>,
    runtime: WebRuntime,
): void {
    let forcedToBeReadonly = false; // Note that readonly is only valid on input and textarea, whereas disabled is valid on select

    for (const propKey of Object.getOwnPropertyNames(props)) {
        if (specialHandlingProps.includes(propKey)) {
            continue;
        }

        // Deal with class (className) and for (htmlFor)
        const mappedPropKey = Object.hasOwn(mappedProperties, propKey)
            ? mappedProperties[propKey]!
            : propKey;

        const value = (props as Untyped)[propKey];

        const isBindable = mappedPropKey.startsWith('bind:');

        if (isBindable && isReadWriteSignal(value)) {
            const bindableMapEntry = bindableMap.get(
                mappedPropKey.substring('bind:'.length),
            );
            if (!bindableMapEntry || !isSignal(value)) {
                continue;
            }

            // ==== MUTABLE SIGNAL SPECIAL CASE BINDING (e.g. input.value) ====
            const { eventName, setDomProperty, getDomProperty } =
                bindableMapEntry;

            setDomProperty(node, value.peek());

            node.addEventListener(eventName, (evt) => {
                const updatedValue = getDomProperty(evt.currentTarget);

                value.update(updatedValue);
            });
            const changeCallback = () => {
                setDomProperty(node, value.peek());
            };

            // Add a weak listener (so that it will be cleaned up when no references held)
            // we will add a strong reference to the DOM element (via WeakMap) to prevent
            // cleanup until the DOM element is no longer reachable
            value.listen(changeCallback, false);

            addExplicitStrongReference(node, changeCallback);
        } else if (mappedPropKey.startsWith('on')) {
            // ==== EVENT HANDLER BINDING ====

            const eventName = mappedPropKey.substring(2);

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
            if (causesReadonlyIfOneWayBound.includes(mappedPropKey)) {
                forcedToBeReadonly = true;
            }

            // ==== NORMAL SIGNAL BINDING ====
            if (isSignal(value)) {
                (node as unknown as Untyped)[mappedPropKey] = value.peek();

                const changeCallback = () => {
                    (node as unknown as Untyped)[mappedPropKey] = value.peek();
                };

                // Add a weak listener (so that it will be cleaned up when no references held)
                // we will add a strong reference to the DOM element (via WeakMap) to prevent
                // cleanup until the DOM element is no longer reachable
                value.listen(changeCallback, false);

                addExplicitStrongReference(node, changeCallback);
            } else {
                (node as unknown as Untyped)[mappedPropKey] = value;
            }
        }

        // They may already be readonly or disabled, this happens last as an override
        // Not sure if this behaviour should be optional
        if (forcedToBeReadonly) {
            if (
                node instanceof HTMLInputElement ||
                node instanceof HTMLTextAreaElement
            ) {
                node.readOnly = true;
            } else if (node instanceof HTMLSelectElement) {
                node.disabled = true; // Need to decide if this is appropriate
            }
        }
    }
}
