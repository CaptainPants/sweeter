import { type PropsWithIntrinsicAttributesFor } from '@captainpants/sweeter-core';
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
    readonly: 'readOnly',
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

/**
 * These attributes require special handling.
 */
const specialHandlingProps = ['children', 'ref', 'class', 'style'];

export function bindDOMMiscProps<TElementType extends string>(
    node: SVGElement | HTMLElement,
    props: PropsWithIntrinsicAttributesFor<TElementType>,
    runtime: WebRuntime,
): void {
    for (const propKey of Object.getOwnPropertyNames(props)) {
        if (specialHandlingProps.includes(propKey)) {
            continue;
        }

        // Deal with class (className) and for (htmlFor)
        const mappedPropKey = Object.hasOwn(mappedProperties, propKey)
            ? mappedProperties[propKey]!
            : propKey;

        const value = (props as Untyped)[propKey];

        if (value === undefined) {
            // don't assign value if undefined- as we rely on undefined to represent 'not present' for convenience, but its not a valid value for a bunch of properties
            continue;
        }

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
                const prev = getDomProperty(node);
                const next = value.peek();

                // If the value hasn't changed, then don't. This is mostly here
                // so that the value.update in the addEventListener above doesn't
                // trigger a disruptive (focus/selection lost) write-back to the
                // input field.
                if (prev !== next) {
                    setDomProperty(node, next);
                }
            };

            // Add a weak listener (so that it will be cleaned up when no references held)
            // we will add a strong reference to the DOM element (via WeakMap) to prevent
            // cleanup until the DOM element is no longer reachable
            value.listenWeak(changeCallback);

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
        }
        else if (mappedPropKey.startsWith('data-')) {
            // ==== data- (and possibly other attr based) bindings ====
            if (isSignal(value)) {
                assignDataAttribute(node, mappedPropKey, value.peek());

                const changeCallback = () => {
                    assignDataAttribute(node, mappedPropKey, value.peek());
                };

                // Add a weak listener (so that it will be cleaned up when no references held)
                // we will add a strong reference to the DOM element (via WeakMap) to prevent
                // cleanup until the DOM element is no longer reachable
                value.listenWeak(changeCallback);

                addExplicitStrongReference(node, changeCallback);
            } else {
                assignDataAttribute(node, mappedPropKey, value);
            }
        } else {
            // ==== NORMAL SIGNAL BINDING ====
            if (isSignal(value)) {
                (node as unknown as Untyped)[mappedPropKey] = value.peek();

                const changeCallback = () => {
                    (node as unknown as Untyped)[mappedPropKey] = value.peek();
                };

                // Add a weak listener (so that it will be cleaned up when no references held)
                // we will add a strong reference to the DOM element (via WeakMap) to prevent
                // cleanup until the DOM element is no longer reachable
                value.listenWeak(changeCallback);

                addExplicitStrongReference(node, changeCallback);
            } else {
                (node as unknown as Untyped)[mappedPropKey] = value;
            }
        }
    }
}

function assignDataAttribute(ele: HTMLElement | SVGElement, name: string, value: unknown) {
    if (typeof value === 'string') {
        ele.setAttribute(name, value);
    }
    else {
        ele.removeAttribute(name);
    }
}