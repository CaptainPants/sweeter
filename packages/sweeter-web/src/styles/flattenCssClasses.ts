import type { Signal } from '@captainpants/sweeter-core';
import { $calc, isSignal, $val } from '@captainpants/sweeter-core';
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
        flattenCssClassesImplementation(classes, context, result);
        return result.join(' ');
    });
}

function flattenCssClassesImplementation(
    classes: ElementCssClasses,
    context: GlobalStyleSheetContentGeneratorContext,
    output: string[],
) {
    const value = $val(classes);

    if (Array.isArray(value)) {
        for (const item of value) {
            flattenCssClassesImplementation(item, context, output);
        }
    } else if (value instanceof GlobalCssClass) {
        output.push(context.getPrefixedClassName(value));
    } else if (isSignal(value)) {
        flattenCssClassesImplementation(value, context, output);
    } else if (typeof value === 'string') {
        output.push(value);
    } else if (value) {
        for (const key of Object.getOwnPropertyNames(value)) {
            if (value![key]!.value) {
                output.push(key);
            }
        }
    }
    // might be null or undefined
}
