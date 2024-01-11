import { type ValidationListener } from '../types.js';
import { Context } from '@captainpants/sweeter-core';

export interface ValidationContainerContextType {
    register: (listener: ValidationListener) => void;
    unregister: (listener: ValidationListener) => void;
    validityChanged: (listener: ValidationListener, newValue: boolean) => void;
}

export const ValidationContainerContext =
    new Context<ValidationContainerContextType>('ValidationContainer', {
        register: () => {
            /* do nothing base implementation */
        },
        unregister: () => {
            /* do nothing base implementation */
        },
        validityChanged: () => {
            /* do nothing base implementation */
        },
    });
