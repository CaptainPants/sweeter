import { type Signal } from '@captainpants/sweeter-core';
import {
    $calc,
    addExplicitStrongReference,
    $val,
} from '@captainpants/sweeter-core';
import { type ElementCssStyles } from '../../IntrinsicAttributes.js';
import { translateNumericPropertyValue } from './translateNumericPropertyValue.js';

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
                    | number
                    | Signal<string | number>
                    | undefined;

                if (rawValue) {
                    let value = $val(rawValue);

                    if (typeof value === 'number') {
                        value = translateNumericPropertyValue(key, value);
                    }

                    result.push(key, ': ', value, ';');
                }
            }
        }

        return result.join('');
    });

    signal.listen(() => {
        node.setAttribute('style', signal.peek());
    });

    node.setAttribute('style', signal.peek());

    addExplicitStrongReference(node, signal);
}
