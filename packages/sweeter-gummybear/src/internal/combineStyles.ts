import { $calc, $val, isSignal, type Signal } from '@captainpants/sweeter-core';
import { type ElementCssStyles } from '@captainpants/sweeter-web';

export function combineStyles(...styles: (ElementCssStyles | Signal<ElementCssStyles | undefined> | undefined)[]): ElementCssStyles | Signal<ElementCssStyles> {
    // If no signals, merge the simple way
    if (styles.every(x => !isSignal(x))) {
        return Object.assign({}, ...styles);
    }

    // If there are any signals we need to subscribe to them all with $val and merge the results
    return $calc(() => {            
        return Object.assign({}, ...styles.map(x => $val(x)));
    });
}
