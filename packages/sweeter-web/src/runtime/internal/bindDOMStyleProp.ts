import { type Signal } from '@captainpants/sweeter-core';
import {
    $calc,
    addExplicitStrongReference,
    $val,
} from '@captainpants/sweeter-core';
import { type Styles } from '../../IntrinsicAttributes.js';

export function bindDOMStyleProp(
    node: HTMLElement | SVGElement,
    styles: Styles | Signal<Styles | undefined>,
) {
    const signal = $calc(() => {
        const result: string[] = [];

        const stylesValue = $val(styles);

        if (stylesValue) {
            for (const key of Object.getOwnPropertyNames(stylesValue)) {
                const value = stylesValue[key as keyof Styles] as
                    | string
                    | Signal<string>
                    | undefined;

                if (value) {
                    result.push(key, ': ', $val(value), ';');
                }
            }
        }

        return result.join('');
    });

    signal.listen(() => {
        node.setAttribute('style', signal.value);
    }, false);

    node.setAttribute('style', signal.peek());

    addExplicitStrongReference(node, signal);
}
