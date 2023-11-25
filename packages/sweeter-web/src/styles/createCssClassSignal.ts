import type { Signal } from '@captainpants/sweeter-core';
import { $calc, isSignal, $val } from '@captainpants/sweeter-core';
import type { ElementCssClasses } from './index.js';
import { GlobalCssClass } from './index.js';

export function createCssClassSignal(
    classes: ElementCssClasses | Signal<ElementCssClasses>,
): Signal<(string | GlobalCssClass)[]> {
    let previous: (string | GlobalCssClass)[] | undefined;

    return $calc(() => {
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
    output: (string | GlobalCssClass)[],
) {
    const value = $val(input);

    if (Array.isArray(value)) {
        for (const item of value) {
            createCssClassSignalImplementation(item, output);
        }
    } else if (value instanceof GlobalCssClass || typeof value === 'string') {
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
