import {
    isWritableSignal,
    listenWhileNotCollected,
    type Signal,
    type WritableSignal,
} from '@serpentis/ptolemy-core';

export function bindRef(
    ele: HTMLElement | SVGElement,
    ref:
        | ((value: Element) => void)
        | Signal<(value: Element) => void>
        | WritableSignal<Element>,
) {
    if (typeof ref === 'function') {
        ref(ele);
    } else {
        // Its a signal

        if (isWritableSignal(ref)) {
            // Writable signal must be of type WritableSignal<Element>
            ref.value = ele;
        } else {
            listenWhileNotCollected(ele, ref, (state) => {
                if (state.mode === 'SUCCESS') {
                    state.value(ele);
                }
            });
        }
    }
}
