import {
    listenWhileNotCollected,
    type PropsInputFor,
    SignalState,
} from '@serpentis/ptolemy-core';
import { isReadWriteSignal, isSignal } from '@serpentis/ptolemy-core';
import { hasOwnProperty } from '@serpentis/ptolemy-utilities';

import { indeterminite } from '../../indeterminate.js';
import { type WebRuntime } from '../types.js';

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
    props: PropsInputFor<TElementType>,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    webRuntime: WebRuntime,
): void {
    for (const propKey of Object.getOwnPropertyNames(props)) {
        if (specialHandlingProps.includes(propKey)) {
            continue;
        }

        // Deal with class (className) and for (htmlFor)
        const mappedPropKey = hasOwnProperty(mappedProperties, propKey)
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

                value.value = updatedValue;
            });
            listenWhileNotCollected(node, value, (newState) => {
                const prev = getDomProperty(node);
                const next = SignalState.getValue(newState);

                // If the value hasn't changed, then don't. This is mostly here
                // so that the value.update in the addEventListener above doesn't
                // trigger a disruptive (focus/selection lost) write-back to the
                // input field.
                if (prev !== next) {
                    setDomProperty(node, next);
                }
            });
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
        } else if (mappedPropKey.startsWith('data-')) {
            // ==== data- (and possibly other attr based) bindings ====
            if (isSignal(value)) {
                assignDataAttribute(node, mappedPropKey, value.peek());

                listenWhileNotCollected(node, value, (newState) => {
                    const value = SignalState.getValue(newState);
                    assignDataAttribute(node, mappedPropKey, value);
                });
            } else {
                assignDataAttribute(node, mappedPropKey, value);
            }
        } else {
            // ==== NORMAL SIGNAL BINDING ====
            if (isSignal(value)) {
                (node as unknown as Untyped)[mappedPropKey] = value.peek();

                listenWhileNotCollected(node, value, (newState) => {
                    const value = SignalState.getValue(newState);
                    (node as unknown as Untyped)[mappedPropKey] = value;
                });
            } else {
                (node as unknown as Untyped)[mappedPropKey] = value;
            }
        }
    }
}

function assignDataAttribute(
    ele: HTMLElement | SVGElement,
    name: string,
    value: unknown,
) {
    if (typeof value === 'string') {
        ele.setAttribute(name, value);
    } else {
        ele.removeAttribute(name);
    }
}
