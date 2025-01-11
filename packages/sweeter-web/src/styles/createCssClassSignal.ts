import { type Signal } from '@captainpants/sweeter-core';
import { $derived, $val, isSignal } from '@captainpants/sweeter-core';

import { type ElementCssClasses } from '../IntrinsicAttributes.js';

import { type AbstractGlobalCssClass } from './index.js';
import { GlobalCssClass } from './index.js';

/**
 * Flatten the provided classes into a Signal of string | GlobalCssClass - that can be subscribed to in case of changes to any of the inputs.
 *
 * The result will be cached based on the contents of the result array so that we can avoid unecessary updates to derived signals (Not sure that
 * this has any great benefit to this but oh well).
 * @param classes
 * @returns
 */
export function createCssClassSignal(
    classes: ElementCssClasses | Signal<ElementCssClasses>,
): Signal<(string | AbstractGlobalCssClass)[]> {
    // retain previous result so that we can preserve identity and prevent dependent signals from updating

    let previous: (string | GlobalCssClass)[] | undefined;

    return $derived(() => {
        const result: (string | GlobalCssClass)[] = [];
        createCssClassSignalImplementation(classes, result);

        if (!previous) {
            previous = result;
            return result;
        }

        const sameItems =
            result.length === previous.length &&
            result.every((item, index) => item === previous![index]);
        if (!sameItems) {
            previous = result;
            return result;
        }

        return previous;
    });
}

function createCssClassSignalImplementation(
    input: ElementCssClasses,
    output: (string | AbstractGlobalCssClass)[],
) {
    const value = $val(input);

    if (Array.isArray(value)) {
        for (const item of value) {
            createCssClassSignalImplementation(item, output);
        }
    } else if (isAbstractGlobalCssClass(value) || typeof value === 'string') {
        output.push(value);
    } else if (isSignal(value)) {
        createCssClassSignalImplementation(value, output);
    } else if (value) {
        for (const key of Object.getOwnPropertyNames(value)) {
            const cond = value[key]!;
            if (isSignal(cond) ? cond.value : cond) {
                output.push(key);
            }
        }
    }
    // might be null or undefined
}

function isAbstractGlobalCssClass(val: unknown): val is AbstractGlobalCssClass {
    return val instanceof GlobalCssClass;
}
