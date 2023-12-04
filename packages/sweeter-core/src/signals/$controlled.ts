import { type SignalController } from './SignalController.js';
import { ControlledSignal } from './internal/ControlledSignal.js';
import { type Signal } from './types.js';

/**
 * Provides a readonly Signal, that can be controlled by using the provided Controller instance. This allows for cases where a Signal is passed to a callback as read only,
 * but needs to be updated by the caller when some condition changes. It is similar to a ReadWriteSignal where the Write component is separated out.
 * @param controller
 * @returns
 */
export function $controlled<T>(controller: SignalController<T>): Signal<T> {
    return new ControlledSignal(controller);
}
