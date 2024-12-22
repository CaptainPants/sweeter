import { type ValidationListener } from '../types.js';
import { ValidationContainerContext } from '../context/ValidationContainerContext.js';
import {
    $insertLocation,
    $mutable,
    $readonly,
    type ComponentInit,
    type Signal,
} from '@captainpants/sweeter-core';

export interface ValidationContainerHookResult {
    validated: (children: () => JSX.Element | undefined) => JSX.Element;

    isValid: Signal<boolean>;
}

function calculateIsValid(listeners: Set<ValidationListener>): boolean {
    return [...listeners].every((x) => x.isValid());
}

export function ValidationContainerHook(
    init: ComponentInit,
): ValidationContainerHookResult {
    const listeners = new Set<ValidationListener>();

    let firstMountComplete = false;
    const isValid = $mutable(true);

    const onValidityChanged = (
        _listener: ValidationListener,
        _valid: boolean,
    ) => {
        if (firstMountComplete) {
            isValid.value = calculateIsValid(listeners);
        }
    };

    const context = {
        register: (listener: ValidationListener) => listeners.add(listener),
        unregister: (listener: ValidationListener) =>
            listeners.delete(listener),
        validityChanged: onValidityChanged,
    };

    const validated = (children: () => JSX.Element | undefined): JSX.Element =>
        ValidationContainerContext.invokeWith(context, $insertLocation(), children);

    init.onMount(() => {
        firstMountComplete = true;
    });

    return { validated, isValid: $readonly(isValid) };
}
