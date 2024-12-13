import {
    listenWhileNotCollected,
    SignalState,
    type Signal,
} from '@captainpants/sweeter-core';
import { $derive, $val } from '@captainpants/sweeter-core';
import { type ElementCssStyles } from '../../IntrinsicAttributes.js';
import { translateNumericPropertyValue } from './translateNumericPropertyValue.js';

export function bindDOMStyleProp(
    node: HTMLElement | SVGElement,
    styles: ElementCssStyles | Signal<ElementCssStyles | undefined>,
) {
    const signal = $derive(() => {
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

    listenWhileNotCollected(node, signal, (newState) => {
        const styleValue = SignalState.getValue(newState);
        if (styleValue) {
            node.setAttribute('style', styleValue);
        } else {
            node.removeAttribute('style');
        }
    });

    const styleValue = signal.peek();
    if (styleValue) {
        node.setAttribute('style', styleValue);
    }
}
