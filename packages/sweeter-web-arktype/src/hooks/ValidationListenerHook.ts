import { type ComponentInit, type Signal } from '@captainpants/sweeter-core';

import { ValidationContainerContext } from '../context/ValidationContainerContext.js';
import { type ValidationListener } from '../types.js';

export function ValidationListenerHook(
    init: ComponentInit,
    listener: ValidationListener,
    valid: Signal<boolean>,
): void {
    const { register, unregister, validityChanged } = init.getContext(
        ValidationContainerContext,
    );

    let wasValid: boolean | null = null;

    init.onMount(() => {
        register(listener);

        return () => unregister(listener);
    });

    init.trackSignals([valid], ([valid]) => {
        // If this is a new control OR the valid value changed
        if (wasValid === null || wasValid !== valid) {
            validityChanged(listener, valid);
        }
        wasValid = valid;
    });
}
