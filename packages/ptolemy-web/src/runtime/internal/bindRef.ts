import { listenWhileNotCollected, Signal } from '@serpentis/ptolemy-core';

export function bindRef(
    ele: HTMLElement | SVGElement,
    ref:
        | ((value: Element) => void)
        | Signal<((value: Element) => void) | undefined>,
) {
    if (typeof ref === 'function') {
        ref(ele);
    } else {
        // Its a signal

        listenWhileNotCollected(ele, ref, (state) => {
            if (state.mode === 'SUCCESS') {
                state.value?.(ele);
            }
        });
    }
}
