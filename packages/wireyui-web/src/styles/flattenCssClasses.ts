import type { Signal } from '@captainpants/wireyui-core';
import { $calc, isSignal, valueOf } from '@captainpants/wireyui-core';
import type { ElementCssClasses } from './index.js';
import { GlobalCssClass } from './index.js';

export type CssClassNameProvider = (cssClass: GlobalCssClass) => string;

export function flattenCssClasses(
    classes: ElementCssClasses | Signal<ElementCssClasses>,
    nameProvider: CssClassNameProvider,
): Signal<string> {
    return $calc(() => {
        const result: string[] = [];
        flatten(classes, nameProvider, result);
        return result.join(' ');
    });
}

function flatten(
    classes: ElementCssClasses,
    nameProvider: CssClassNameProvider,
    output: string[],
) {
    const value = valueOf(classes);

    if (Array.isArray(value)) {
        for (const item of value) {
            flatten(item, nameProvider, output);
        }
    } else if (value instanceof GlobalCssClass) {
        output.push(nameProvider(value));
    } else if (isSignal(value)) {
        flatten(valueOf(value), nameProvider, output);
    } else if (value) {
        output.push(value);
    }
    // might be null or undefined
}
