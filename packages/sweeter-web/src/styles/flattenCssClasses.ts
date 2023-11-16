import type { Signal } from '@captainpants/sweeter-core';
import { $calc, isSignal, valueOf } from '@captainpants/sweeter-core';
import type {
    ElementCssClasses,
    GlobalStyleSheetContentGeneratorContext,
} from './index.js';
import { GlobalCssClass } from './index.js';

export function flattenCssClasses(
    classes: ElementCssClasses | Signal<ElementCssClasses>,
    context: GlobalStyleSheetContentGeneratorContext,
): Signal<string> {
    return $calc(() => {
        const result: string[] = [];
        flatten(classes, context, result);
        return result.join(' ');
    });
}

function flatten(
    classes: ElementCssClasses,
    context: GlobalStyleSheetContentGeneratorContext,
    output: string[],
) {
    const value = valueOf(classes);

    if (Array.isArray(value)) {
        for (const item of value) {
            flatten(item, context, output);
        }
    } else if (value instanceof GlobalCssClass) {
        output.push(context.getClassName(value));
    } else if (isSignal(value)) {
        flatten(valueOf(value), context, output);
    } else if (value) {
        output.push(value);
    }
    // might be null or undefined
}