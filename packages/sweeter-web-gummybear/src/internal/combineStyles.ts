import {
    $derived,
    $val,
    isSignal,
    type Signal,
} from '@captainpants/sweeter-core';
import { type ElementCssStyles } from '@captainpants/sweeter-web';

export function combineStyles(
    ...styles: (
        | ElementCssStyles
        | Signal<ElementCssStyles | undefined>
        | undefined
    )[]
): ElementCssStyles | Signal<ElementCssStyles> {
    // If no signals, merge the simple way
    if (styles.every((x) => !isSignal(x))) {
        const result: ElementCssStyles = {};
        Object.assign(result, ...styles);
        return result;
    }

    // If there are any signals we need to subscribe to them all with $val and merge the results
    return $derived<ElementCssStyles>(() => {
        const result: ElementCssStyles = {};
        Object.assign(result, ...styles.map((x) => $val(x)));
        return result;
    });
}
