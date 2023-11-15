import type { Signal } from '@captainpants/wireyui-core';
import {
    $calc,
    addExplicitStrongReference,
    valueOf,
} from '@captainpants/wireyui-core';
import { type Styles } from '../../IntrinsicAttributes.js';

export function bindStyle(node: HTMLElement | SVGElement, styles: Styles) {
    const signal = $calc(() => {
        const result: string[] = [];

        for (const key of Object.getOwnPropertyNames(styles)) {
            const value = styles[key as keyof Styles] as
                | string
                | Signal<string>;

            result.push(key, ': ', valueOf(value), ';');
        }

        return result.join('');
    });

    signal.listen(() => {
        node.setAttribute('style', signal.value);
    }, false);

    node.setAttribute('style', signal.peek());

    addExplicitStrongReference(node, signal);
}
