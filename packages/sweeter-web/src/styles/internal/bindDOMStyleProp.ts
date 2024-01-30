import { type Signal } from '@captainpants/sweeter-core';
import {
    $calc,
    addExplicitStrongReference,
    $val,
} from '@captainpants/sweeter-core';
import { type ElementCssStyles } from '../../IntrinsicAttributes.js';

function allSizes(
    prop: string,
    prefix: string = prop + '-',
    suffix: string = '',
) {
    return [
        prop,
        prefix + 'top' + suffix,
        prefix + 'right' + suffix,
        prefix + 'bottom' + suffix,
        prefix + 'left' + suffix,
    ];
}

const pxProperties = ['width', 'height']
    .concat(allSizes('padding'))
    .concat(allSizes('margin'))
    .concat(allSizes('border-width', 'border-', '-width'));

const suffixes: Record<string, string> = {};
for (const item of pxProperties) {
    suffixes[item] = 'px';
}

export function bindDOMStyleProp(
    node: HTMLElement | SVGElement,
    styles: ElementCssStyles | Signal<ElementCssStyles | undefined>,
) {
    const signal = $calc(() => {
        const result: string[] = [];

        const stylesValue = $val(styles);

        if (stylesValue) {
            for (const key of Object.getOwnPropertyNames(stylesValue)) {
                const rawValue = stylesValue[key as keyof ElementCssStyles] as
                    | string
                    | Signal<string>
                    | undefined;

                if (rawValue) {
                    let value = $val(rawValue);

                    // Add px if needed
                    if (typeof value === 'number') {
                        const suffix = suffixes[key];

                        if (suffix) {
                            value = value + suffix;
                        }
                    }

                    result.push(key, ': ', $val(rawValue), ';');
                }
            }
        }

        return result.join('');
    });

    signal.listen(() => {
        node.setAttribute('style', signal.peek());
    }, false);

    node.setAttribute('style', signal.peek());

    addExplicitStrongReference(node, signal);
}
